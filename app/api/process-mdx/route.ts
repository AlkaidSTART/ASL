import { NextRequest, NextResponse } from 'next/server';
import { autoProcessMdxFiles } from '@/lib/mdx-processor';
import path from 'path';
import fs from 'fs';

// 配置为静态导出
export const dynamic = 'force-static';
export const revalidate = 3600; // 1小时重新验证

/**
 * POST /api/process-mdx
 * 处理 MDX 文件并生成博客索引
 */
export async function POST(_request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 开始处理 MDX 文件...');
    }
    
    // 执行自动处理
    autoProcessMdxFiles();
    
    return NextResponse.json({
      success: true,
      message: 'MDX 文件处理完成',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MDX 处理失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'MDX 处理失败',
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : '未知错误')
          : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/process-mdx
 * 获取 MDX 处理状态和博客数据
 */
export async function GET(_request: NextRequest) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'posts');
    const indexPath = path.join(process.cwd(), 'lib', 'blog-index.ts');
    
    // 检查索引文件是否存在
    let hasIndex = false;
    let indexTime = null;
    
    if (fs.existsSync(indexPath)) {
      hasIndex = true;
      const stats = fs.statSync(indexPath);
      indexTime = stats.mtime.toISOString();
    }
    
    // 获取 MDX 文件列表
    const { scanMdxFiles } = await import('@/lib/mdx-processor');
    const mdxFiles = scanMdxFiles(contentDir);
    
    // 返回状态信息
    return NextResponse.json({
      success: true,
      data: {
        mdxFiles: mdxFiles.length,
        hasIndex,
        indexTime,
        message: hasIndex ? '索引文件已生成' : '需要生成索引文件'
      }
    });
  } catch (error) {
    console.error('获取状态失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取状态失败',
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : '未知错误')
          : undefined
      },
      { status: 500 }
    );
  }
}