'use client';

import { PostList } from '@/components/PostList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { usePageStore } from '@/stores/pageStore';

// 模拟数据，避免在客户端组件中使用服务器端函数
const mockPosts = [
  {
    slug: 'sample-article',
    title: '示例文章',
    date: '2024-03-13',
    description: '这是一个示例文章，用于展示博客功能。',
    tags: ['示例', '测试', '博客'],
    content: '这是示例文章的内容...'
  },
  {
    slug: 'enhanced-test',
    title: '增强版测试文章',
    date: '2024-03-13',
    description: '这是一个增强版测试文章，展示了MDX转换功能。',
    tags: ['测试', 'MDX', '增强功能'],
    content: '这是增强版测试文章的内容...'
  }
];

export default function BlogIndex() {
  const { setIsBlogPost } = usePageStore();

  useEffect(() => {
    // 博客列表页面需要显示header，所以设置为false
    setIsBlogPost(false);
    return () => {
      // 清理状态
      setIsBlogPost(false);
    };
  }, [setIsBlogPost]);

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回主页按钮 */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          href="/" 
          className="ios-26-liquid-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="lang-en">Back to Home</span>
          <span className="lang-zh">返回主页</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12 sm:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 mt-20 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white sm:text-5xl">
            <span className="lang-en ">Latest Posts</span>
            <span className="lang-zh ">最新文章</span>
          </h1>
          <p className="mx-auto mt-20 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            <span className="lang-en">Thoughts, tutorials, and insights on Vibe Coding and AI.</span>
            <span className="lang-zh">关于 Vibe Coding 和 AI 的思考、教程与见解。</span>
          </p>
        </div>
        
        <PostList posts={mockPosts} />
      </div>
    </div>
  );
}