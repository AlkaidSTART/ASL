import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownDir = path.join(process.cwd(), 'content/markdown-posts');
const mdxDir = path.join(process.cwd(), 'content/posts');

/**
 * 增强版Markdown到MDX转换
 * 使用已安装的专业库进行转换
 */
export async function convertMarkdownToMdxEnhanced() {
  try {
    // 确保目标目录存在
    if (!fs.existsSync(mdxDir)) {
      fs.mkdirSync(mdxDir, { recursive: true });
    }

    // 确保源目录存在
    if (!fs.existsSync(markdownDir)) {
      console.log('Markdown文件夹不存在，创建文件夹...');
      fs.mkdirSync(markdownDir, { recursive: true });
      return;
    }

    // 读取所有markdown文件
    const files = fs.readdirSync(markdownDir).filter(file => file.endsWith('.md'));
    
    console.log(`找到 ${files.length} 个Markdown文件需要转换`);

    for (const file of files) {
      const filePath = path.join(markdownDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // 使用gray-matter解析前端元数据
      const { data, content: markdownContent } = matter(content);
      
      // 增强MDX内容处理
      let processedContent = markdownContent;
      
      // 1. 代码块增强 - 添加语言标识
      processedContent = processedContent.replace(/```(\w+)\n([\s\S]*?)```/g, '```$1\n$2\n```');
      
      // 2. 图片处理 - 优化图片语法
      processedContent = processedContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        // 如果是相对路径，添加适当的处理
        if (!src.startsWith('http') && !src.startsWith('/')) {
          return `![${alt}](/images/${src})`;
        }
        return match;
      });
      
      // 3. 内部链接处理
      processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, '[$1](/blog/$2)');
      
      // 4. 添加MDX组件支持标记
      processedContent = processedContent.replace(/:::([a-zA-Z]+)\n([\s\S]*?):::/g, '<$1>\n$2\n</$1>');
      
      // 生成MDX文件名
      const mdxFileName = file.replace('.md', '.mdx');
      const mdxFilePath = path.join(mdxDir, mdxFileName);
      
      // 构建增强的MDX内容
      const enhancedMdxContent = matter.stringify(processedContent, data);
      
      // 写入MDX文件
      fs.writeFileSync(mdxFilePath, enhancedMdxContent);
      
      console.log(`✓ 转换完成: ${file} -> ${mdxFileName}`);
      console.log(`  - 标题: ${data.title || '无标题'}`);
      console.log(`  - 日期: ${data.date || '无日期'}`);
      console.log(`  - 标签: ${data.tags ? data.tags.join(', ') : '无标签'}`);
    }

    console.log('\n🎉 所有Markdown文件转换完成！');
    console.log(`📁 输出目录: ${mdxDir}`);
    
    // 转换完成后自动处理MDX文件
    console.log('🔄 开始处理MDX文件元数据...');
    try {
      const { processMdxIfNeeded } = await import('./mdx-build.ts');
      const success = processMdxIfNeeded();
      if (success) {
        console.log('✅ MDX文件处理完成');
      } else {
        console.log('⚠️  MDX文件处理失败');
      }
    } catch (mdxError) {
      console.error('MDX处理错误:', mdxError);
    }
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
  
  if (!fs.existsSync(markdownDir)) {
    console.log('⚠️  Markdown文件夹不存在，跳过监听');
    return;
  }
  
  fs.watch(markdownDir, async (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
      console.log(`\n📝 检测到文件变化: ${filename} (${eventType})`);
      console.log('🔄 开始自动转换...');
      try {
        await convertMarkdownToMdxEnhanced();
        console.log('✅ 自动转换完成！');
      } catch (error) {
        console.error('❌ 自动转换失败:', error);
      }
    }
  });
  
  console.log('✅ 监听器已启动，任何Markdown文件变化将自动转换');
  console.log('💡 提示: 按 Ctrl+C 停止监听');
}

// 如果直接运行此模块，执行转换
if (import.meta.url === `file://${process.argv[1]}`) {
  convertMarkdownToMdxEnhanced();
}