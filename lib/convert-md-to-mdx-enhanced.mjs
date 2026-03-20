import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import chokidar from 'chokidar';

const markdownDir = path.join(process.cwd(), 'content/markdown-posts');
const mdxDir = path.join(process.cwd(), 'content/posts');

const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+\.md)(#[^)]+)?\)/g;
const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
const customBlockRegex = /:::([a-zA-Z][\w-]*)\n([\s\S]*?):::/g;

async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeFrontmatter(data, sourceFileName) {
  const fallbackTitle = sourceFileName.replace(/\.md$/i, '');

  return {
    title: data.title ?? fallbackTitle,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    description: data.description ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    ...data,
  };
}

function transformMarkdownToMdxContent(markdownContent) {
  const withImages = markdownContent.replace(markdownImageRegex, (match, alt, src) => {
    const trimmedSrc = src.trim();
    const isExternal = /^(https?:)?\/\//i.test(trimmedSrc);
    const isAbsolute = trimmedSrc.startsWith('/');
    if (isExternal || isAbsolute) {
      return match;
    }

    const normalized = trimmedSrc.replace(/^\.\//, '');
    return `![${alt}](/images/${normalized})`;
  });

  const withLinks = withImages.replace(markdownLinkRegex, (_, text, link, hash = '') => {
    const parsed = path.parse(link.trim());
    return `[${text}](/blog/${parsed.name}${hash})`;
  });

  return withLinks.replace(customBlockRegex, '<$1>\n$2\n</$1>');
}

function toMdxFileName(markdownFileName) {
  return markdownFileName.replace(/\.md$/i, '.mdx');
}

async function convertSingleFile(markdownFileName) {
  const sourcePath = path.join(markdownDir, markdownFileName);
  const targetName = toMdxFileName(markdownFileName);
  const targetPath = path.join(mdxDir, targetName);

  const raw = await fs.readFile(sourcePath, 'utf8');
  const { data, content } = matter(raw);

  const normalizedData = normalizeFrontmatter(data, markdownFileName);
  const transformedContent = transformMarkdownToMdxContent(content);
  const nextMdx = matter.stringify(transformedContent, normalizedData);

  if (await pathExists(targetPath)) {
    const currentMdx = await fs.readFile(targetPath, 'utf8');
    if (currentMdx === nextMdx) {
      return { changed: false, source: markdownFileName, target: targetName };
    }
  }

  await fs.writeFile(targetPath, nextMdx, 'utf8');
  return { changed: true, source: markdownFileName, target: targetName };
}

async function removeConvertedFile(markdownFileName) {
  const targetPath = path.join(mdxDir, toMdxFileName(markdownFileName));
  if (await pathExists(targetPath)) {
    await fs.unlink(targetPath);
    return true;
  }
  return false;
}

async function getMarkdownFiles() {
  const entries = await fs.readdir(markdownDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

/**
 * 增强版Markdown到MDX转换
 * 使用统一转换管线进行增量处理
 */
export async function convertMarkdownToMdxEnhanced() {
  try {
    await ensureDirectory(mdxDir);

    if (!(await pathExists(markdownDir))) {
      console.log('Markdown文件夹不存在，创建文件夹...');
      await ensureDirectory(markdownDir);
      return;
    }

    const files = await getMarkdownFiles();
    console.log(`找到 ${files.length} 个Markdown文件需要转换`);

    let changedCount = 0;
    for (const file of files) {
      const result = await convertSingleFile(file);
      if (result.changed) {
        changedCount += 1;
        console.log(`✓ 转换完成: ${result.source} -> ${result.target}`);
      } else {
        console.log(`- 跳过未变化文件: ${result.source}`);
      }
    }

    console.log(`\n🎉 转换完成：${changedCount}/${files.length} 个文件已更新`);
    console.log(`📁 输出目录: ${mdxDir}`);
  } catch (error) {
    console.error('转换过程中出现错误:', error);
    throw error;
  }
}

/**
 * 监听markdown文件夹变化（开发环境使用）
 */
export function watchMarkdownFilesEnhanced() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('🔍 开始监听Markdown文件变化...');
  console.log(`📂 监听目录: ${markdownDir}`);
  
  const watcher = chokidar.watch(markdownDir, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  let pendingTimer = null;
  const queue = new Map();

  const flushQueue = async () => {
    const tasks = Array.from(queue.values());
    queue.clear();

    for (const task of tasks) {
      try {
        if (task.type === 'unlink') {
          const removed = await removeConvertedFile(task.fileName);
          console.log(removed ? `🗑️ 已删除: ${toMdxFileName(task.fileName)}` : `- 无需删除: ${toMdxFileName(task.fileName)}`);
        } else {
          const result = await convertSingleFile(task.fileName);
          console.log(result.changed ? `✅ 已更新: ${result.target}` : `- 无变化: ${result.target}`);
        }
      } catch (error) {
        console.error(`❌ 处理失败: ${task.fileName}`, error);
      }
    }
  };

  const enqueue = (type, filePath) => {
    const fileName = path.basename(filePath);
    if (!fileName.toLowerCase().endsWith('.md')) {
      return;
    }

    queue.set(fileName, { type, fileName });
    if (pendingTimer) {
      clearTimeout(pendingTimer);
    }

    pendingTimer = setTimeout(() => {
      void flushQueue();
    }, 150);
  };

  watcher
    .on('add', (filePath) => enqueue('add', filePath))
    .on('change', (filePath) => enqueue('change', filePath))
    .on('unlink', (filePath) => enqueue('unlink', filePath))
    .on('error', (error) => {
      console.error('❌ 文件监听出错:', error);
    });
  
  console.log('✅ 监听器已启动，任何Markdown文件变化将自动转换');
  console.log('💡 提示: 按 Ctrl+C 停止监听');
}

// 如果直接运行此模块，执行转换
if (import.meta.url === `file://${process.argv[1]}`) {
  convertMarkdownToMdxEnhanced();
}