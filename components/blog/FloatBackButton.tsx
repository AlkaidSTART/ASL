'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function FloatBackButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 如果向下滚动并且超过100px，隐藏；如果有明显向上滚动，或回到顶部，显示
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed left-4 z-50 sm:left-6 sm:top-6 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
    >
      <Link
        href="/blog"
        className="flex items-center gap-2 rounded-2xl border border-zinc-200/50 bg-white/40 px-3 py-2 text-sm font-medium text-gray-700 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:text-gray-300 dark:hover:bg-zinc-800/80"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">
          {mounted ? (language === 'zh' ? '返回博客' : 'Back to Blog') : '返回博客'}
        </span>
      </Link>
    </div>
  );
}