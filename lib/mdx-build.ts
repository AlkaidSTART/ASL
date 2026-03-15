/**
 * MDX 文件转换和索引生成脚本
 * 在构建过程中自动处理 MDX 文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 运行 MDX 处理
 */
export function runMdxProcessing() {
  console.log('🔄 开始处理 MDX 文件...');
  
  try {
    // 执行 MDX 处理
    const result = execSync('npx tsx lib/mdx-processor.ts', {
      encoding: 'utf-8',
      cwd: process.cwd()
    });
    
    console.log(result);
    console.log('✅ MDX 文件处理完成');
    return true;
  } catch (error) {
    console.error('❌ MDX 处理失败:', error);
    return false;
  }
}

/**
 * 检查是否需要处理 MDX 文件
 */
export function shouldProcessMdx(): boolean {
  const contentDir = path.join(process.cwd(), 'content', 'posts');
  const indexPath = path.join(process.cwd(), 'lib', 'blog-index.ts');
  
  // 如果索引文件不存在，需要处理
  if (!fs.existsSync(indexPath)) {
    console.log('📝 检测到缺少索引文件，需要处理 MDX');
    return true;
  }
  
  // 检查内容目录是否存在 MDX 文件
  if (!fs.existsSync(contentDir)) {
    console.log('📁 内容目录不存在');
    return false;
  }
  
  const files = fs.readdirSync(contentDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  
  if (mdxFiles.length === 0) {
    console.log('📄 未找到 MDX 文件');
    return false;
  }
  
  console.log(`📊 找到 ${mdxFiles.length} 个 MDX 文件`);
  
  // 检查索引文件是否过期
  const indexStats = fs.statSync(indexPath);
  const indexTime = indexStats.mtime;
  
  // 检查是否有新的或修改过的 MDX 文件
  const hasRecentChanges = mdxFiles.some(file => {
    const filePath = path.join(contentDir, file);
    const fileStats = fs.statSync(filePath);
    return fileStats.mtime > indexTime;
  });
  
  if (hasRecentChanges) {
    console.log('🔄 检测到 MDX 文件有更新，需要重新处理');
    return true;
  }
  
  console.log('✅ MDX 索引已是最新');
  return false;
}

/**
 * 主处理函数
 */
export function processMdxIfNeeded(): boolean {
  if (shouldProcessMdx()) {
    return runMdxProcessing();
  }
  return true;
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  processMdxIfNeeded();
}