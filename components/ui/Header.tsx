'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, User, Mail, Github, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      <header className="flex h-16 items-center justify-between rounded-full border border-white/20 bg-white/30 px-4 shadow-lg shadow-black/5 backdrop-blur-[20px] backdrop-saturate-150 transition-all duration-300 dark:bg-black/30 dark:border-white/10 dark:shadow-white/5 supports-[backdrop-filter]:bg-white/20 dark:supports-[backdrop-filter]:bg-black/20">
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
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-gray-600 transition-all hover:bg-black/10 hover:text-gray-900 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 dark:hover:text-white sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-20 flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:bg-black/60 dark:border-white/10"
          >
            {navItems.map((item) => {
              const isActive = item.path === '/' ? pathname === '/' : pathname?.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-black/5 text-gray-900 dark:bg-white/10 dark:text-white'
                      : 'text-gray-600 hover:bg-black/5 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="lang-en">{item.labelEn}</span>
                  <span className="lang-zh">{item.labelZh}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
