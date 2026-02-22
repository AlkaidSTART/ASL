'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, User, Mail, Github } from 'lucide-react';
import Search from '../Search';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const navItems = [
  { path: '/', labelEn: 'Home', labelZh: '首页', icon: Home },
  { path: '/blog', labelEn: 'Blog', labelZh: '博客', icon: BookOpen },
  { path: '/about', labelEn: 'About', labelZh: '关于', icon: User },
  { path: '/contact', labelEn: 'Contact', labelZh: '联系', icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [lang, setLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const initial = (stored === 'zh' || stored === 'en') ? stored : browserLang;
    
    // Only update state if different from default 'en'
    if (initial !== 'en') {
      setLang(initial as 'en' | 'zh');
    }
    document.documentElement.dataset.lang = initial;
    localStorage.setItem('lang', initial);
  }, []);

  const toggleLang = () => {
    setLang((current) => {
      const next = current === 'en' ? 'zh' : 'en';
      document.documentElement.dataset.lang = next;
      localStorage.setItem('lang', next);
      return next;
    });
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4">
      <header className="flex h-16 items-center justify-between rounded-full border border-white/20 bg-white/70 px-4 shadow-xl backdrop-blur-xl transition-colors duration-300 dark:bg-black/70 dark:border-white/10 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <img src={`${basePath}/avatorone.jpg`} alt="AlkaidLight" className="h-9 w-9 rounded-full border border-white/20" />
            <span className="hidden font-extrabold sm:block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              AlkaidLight
            </span>
          </Link>
          
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
              
              return (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon className={`h-4 w-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="lang-en">{item.labelEn}</span>
                    <span className="lang-zh">{item.labelZh}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Search />
          <button
            type="button"
            onClick={toggleLang}
            className="relative inline-flex h-8 w-20 items-center rounded-full bg-black/5 p-1 transition-colors dark:bg-white/10"
            aria-label="Toggle language"
          >
            <div className="toggle-bg absolute left-1 h-6 w-[calc(50%-4px)] rounded-full bg-white shadow-sm dark:bg-gray-600" />
            <span className="z-10 w-1/2 text-center text-[10px] font-bold toggle-text-en">EN</span>
            <span className="z-10 w-1/2 text-center text-[10px] font-bold toggle-text-zh">中文</span>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-gray-600 transition-all hover:bg-black/10 hover:text-gray-900 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 dark:hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>
    </div>
  );
}
