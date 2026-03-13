// 增强版Markdown文件监听器
import { watchMarkdownFilesEnhanced } from '../lib/convert-md-to-mdx-enhanced.mjs';

console.log('🚀 增强版Markdown文件监听器启动...');
console.log('📁 监听目录: content/markdown-posts');
console.log('🔄 转换目标: content/posts');
console.log('⚡ 增强功能: 代码块优化、图片处理、链接转换');
console.log('');

// 启动监听
watchMarkdownFilesEnhanced();