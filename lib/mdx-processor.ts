/**
 * MDX 元数据提取工具
 * 用于从 MDX 文件中提取 frontmatter 元数据
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  readingTime: number;
  wordCount: number;
}

export interface BlogMetadata {
  posts: BlogPost[];
  totalPosts: number;
  latestPost: BlogPost | null;
  tags: string[];
  archive: Record<string, BlogPost[]>;
}

/**
 * 提取 MDX 文件元数据
 * @param filePath - MDX 文件路径
 * @returns 提取的元数据
 */
export function extractMdxMetadata(filePath: string): BlogPost | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    // 验证必需的元数据字段
    if (!data.title || !data.date) {
      console.warn(`跳过文件 ${filePath}: 缺少必需的元数据字段`);
      return null;
    }

    // 计算阅读时间和字数
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200); // 假设每分钟阅读200字

    // 从文件路径提取 slug
    const fileName = path.basename(filePath, '.mdx');
    const slug = fileName;

    return {
      slug,
      title: data.title || '无标题',
      date: data.date || new Date().toISOString(),
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: content.trim(),
      readingTime,
      wordCount
    };
  } catch (error) {
    console.error(`提取元数据失败 ${filePath}:`, error);
    return null;
  }
}

/**
 * 扫描目录中的所有 MDX 文件
 * @param directory - 扫描目录
 * @returns MDX 文件路径数组
 */
export function scanMdxFiles(directory: string): string[] {
  try {
    const files = fs.readdirSync(directory);
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => path.join(directory, file))
      .filter(filePath => fs.statSync(filePath).isFile());
  } catch (error) {
    console.error(`扫描目录失败 ${directory}:`, error);
    return [];
  }
}

/**
 * 处理所有 MDX 文件并提取元数据
 * @param directory - MDX 文件目录
 * @returns 博客元数据
 */
export function processMdxFiles(directory: string): BlogMetadata {
  const mdxFiles = scanMdxFiles(directory);
  const posts: BlogPost[] = [];
  const allTags = new Set<string>();
  const archive: Record<string, BlogPost[]> = {};

  // 处理每个 MDX 文件
  mdxFiles.forEach(filePath => {
    const post = extractMdxMetadata(filePath);
    if (post) {
      posts.push(post);
      
      // 收集标签
      post.tags.forEach(tag => allTags.add(tag));
      
      // 按月份归档
      const month = post.date.substring(0, 7); // YYYY-MM
      if (!archive[month]) {
        archive[month] = [];
      }
      archive[month].push(post);
    }
  });

  // 按日期排序（最新的在前）
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 按月份归档排序
  Object.keys(archive).forEach(month => {
    archive[month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  return {
    posts,
    totalPosts: posts.length,
    latestPost: posts[0] || null,
    tags: Array.from(allTags).sort(),
    archive
  };
}

/**
 * 生成博客索引文件
 * @param metadata - 博客元数据
 * @param outputPath - 输出文件路径
 */
export function generateBlogIndex(metadata: BlogMetadata, outputPath: string): void {
  const indexContent = `// 自动生成的博客索引文件
// 生成时间: ${new Date().toISOString()}

import type { BlogPost, BlogMetadata } from '@/lib/mdx-processor';

// 重新导出类型，供其他模块使用
export type { BlogPost, BlogMetadata };

export const blogMetadata: BlogMetadata = ${JSON.stringify(metadata, null, 2)};

// 便捷访问函数
export const getAllPosts = (): BlogPost[] => blogMetadata.posts;
export const getLatestPost = (): BlogPost | null => blogMetadata.latestPost;
export const getAllTags = (): string[] => blogMetadata.tags;
export const getPostsByTag = (tag: string): BlogPost[] => 
  blogMetadata.posts.filter(post => post.tags.includes(tag));
export const getPostsByMonth = (month: string): BlogPost[] => 
  blogMetadata.archive[month] || [];
export const getPostBySlug = (slug: string): BlogPost | undefined => 
  blogMetadata.posts.find(post => post.slug === slug);
`;

  try {
    fs.writeFileSync(outputPath, indexContent, 'utf-8');
    console.log(`✅ 博客索引已生成: ${outputPath}`);
  } catch (error) {
    console.error(`生成索引文件失败:`, error);
  }
}

/**
 * 自动处理 MDX 文件并生成索引
 * 用于构建过程中的自动化处理
 */
export function autoProcessMdxFiles(): void {
  const contentDir = path.join(process.cwd(), 'content', 'posts');
  const outputPath = path.join(process.cwd(), 'lib', 'blog-index.ts');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 开始处理 MDX 文件...');
  }
  
  const metadata = processMdxFiles(contentDir);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 处理完成:`);
    console.log(`   - 文章数量: ${metadata.totalPosts}`);
    console.log(`   - 标签数量: ${metadata.tags.length}`);
    console.log(`   - 归档月份: ${Object.keys(metadata.archive).length}`);
  }
  
  generateBlogIndex(metadata, outputPath);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ MDX 文件处理完成！');
  }
}

// 如果直接运行此文件，执行自动处理
if (require.main === module) {
  autoProcessMdxFiles();
}