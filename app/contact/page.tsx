'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePageStore } from '@/stores/pageStore';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Contact() {
  const { setIsContactPage } = usePageStore();

  useEffect(() => {
    setIsContactPage(true);
    return () => {
      setIsContactPage(false);
    };
  }, [setIsContactPage]);

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回主页按钮 */}
      <div className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 sm:left-6 sm:top-6">
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

      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <h1 className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          <img src={`${basePath}/avatorone.jpg`} alt="AlkaidLight" className="h-14 sm:h-16" />
        </h1>
        <p className="mb-10 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg lg:text-xl">
          <span className="lang-en">A personal blog built with Next.js, Vibe Coding, and AI.</span>
          <span className="lang-zh">一个使用 Next.js、Vibe Coding 与 AI 构建的个人博客。</span>
        </p>
      </div>
    </div>
  );
}