'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePageStore } from '@/stores/pageStore';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function About() {
  const { setIsAboutPage } = usePageStore();

  useEffect(() => {
    setIsAboutPage(true);
    return () => {
      setIsAboutPage(false);
    };
  }, [setIsAboutPage]);

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回主页按钮 */}
      <div className="fixed top-4 left-4 z-50 sm:top-6 sm:left-6">
        <Link 
          href="/" 
          className="ios-26-liquid-button flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">
            <span className="lang-en">Back to Home</span>
            <span className="lang-zh">返回主页</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 sm:text-7xl">
          <img src={`${basePath}/avatorone.jpg`} alt="AlkaidLight" className="h-16" />
        </h1>
        <p className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
          <span className="lang-en">A personal blog built with Next.js, Vibe Coding, and AI.</span>
          <span className="lang-zh">一个使用 Next.js、Vibe Coding 与 AI 构建的个人博客。</span>
        </p>
      </div>
    </div>
  );
}