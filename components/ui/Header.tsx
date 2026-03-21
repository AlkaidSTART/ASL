'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Home, BookOpen, User, Mail, Github, Menu, X } from 'lucide-react';
import Search from '../Search';
import { usePageStore } from '@/stores/pageStore';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/blog', label: '博客', icon: BookOpen },
  { path: '/about', label: '关于', icon: User },
  { path: '/contact', label: '联系', icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const { 
    isBlogPost, 
    isAboutPage, 
    isContactPage, 
    setIsBlogPost, 
    setIsAboutPage, 
    setIsContactPage, 
    resetPageStates 
  } = usePageStore();

  // 检测页面类型
  useEffect(() => {
    const isBlogArticle = pathname?.startsWith('/blog/') && pathname !== '/blog';
    if (isBlogArticle) setIsBlogPost(true);
    else if (pathname === '/about') setIsAboutPage(true);
    else if (pathname === '/contact') setIsContactPage(true);
    else resetPageStates();
  }, [pathname, setIsBlogPost, setIsAboutPage, setIsContactPage, resetPageStates]);

  // 入场动画
  useEffect(() => {
    if (isBlogPost || isAboutPage || isContactPage || !containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        clearProps: "all"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isBlogPost, isAboutPage, isContactPage]);

  // 指示器滑动动画（液态吸附效果）
  const updateIndicator = (targetPath: string) => {
    if (!navRef.current || !indicatorRef.current) return;
    const targetItem = navRef.current.querySelector(`[data-path="${targetPath}"]`) as HTMLElement;
    
    if (targetItem) {
      gsap.to(indicatorRef.current, {
        x: targetItem.offsetLeft,
        width: targetItem.offsetWidth,
        duration: 0.6,
        ease: "elastic.out(1, 0.7)", // 物理弹簧感
        opacity: 1
      });
    } else {
      gsap.to(indicatorRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  useEffect(() => {
    const activePath = hoveredPath || pathname;
    updateIndicator(activePath);
  }, [pathname, hoveredPath]);

  // 组件加载完毕后对齐指示器
  useEffect(() => {
    const timer = setTimeout(() => updateIndicator(pathname), 150);
    return () => clearTimeout(timer);
  }, [pathname]);

  // 路由变化 / 移动端控制
  useEffect(() => {
    const timer = setTimeout(() => setMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // 整体 Header 的悬浮物理感
  const handleContainerEnter = () => {
    gsap.to(containerRef.current, {
      y: 8,
      duration: 0.6,
      ease: "power3.out"
    });
    gsap.to(headerRef.current, {
      scale: 1.005,
      y: -2,
      duration: 0.6,
      ease: "power3.out"
    });
  };

  const handleContainerLeave = () => {
    gsap.to(containerRef.current, {
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)"
    });
    gsap.to(headerRef.current, {
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)"
    });
  };

  // 移动端菜单下拉交错动画
  useEffect(() => {
    if (!mobileMenuRef.current || !backdropRef.current) return;
    
    if (mobileMenuOpen) {
      gsap.set(backdropRef.current, { display: "block" });
      gsap.set(mobileMenuRef.current, { display: "flex", transformOrigin: "top center" });
      
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(mobileMenuRef.current, 
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)" }
      );
      
      gsap.fromTo(".mobile-item-anim", 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
      );
    } else {
      gsap.to(backdropRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: "power2.in", 
        onComplete: () => gsap.set(backdropRef.current, { display: "none" }) 
      });
      gsap.to(mobileMenuRef.current, { 
        opacity: 0, 
        y: -15, 
        scale: 0.98,
        duration: 0.3, 
        ease: "power2.in",
        onComplete: () => gsap.set(mobileMenuRef.current, { display: "none" }) 
      });
    }
  }, [mobileMenuOpen]);

  if (isBlogPost || isAboutPage || isContactPage) {
    return null;
  }

  return (
    <div 
      className="fixed left-1/2 z-50 box-border w-full max-w-6xl -translate-x-1/2 px-2 sm:top-4 sm:px-4"
      style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
    >
      {/* 桌面端外层包裹容器 */}
      <div 
        ref={containerRef}
        className="group relative"
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
      >
        {/* 背景样式层 - 极简透明质感 */}
        <div className="absolute inset-0 -z-10 rounded-2xl sm:rounded-[20px] bg-white/20 dark:bg-zinc-950/20 backdrop-blur-md border border-white/30 dark:border-zinc-800/30 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:bg-white/40 dark:group-hover:bg-zinc-900/40 group-hover:backdrop-blur-xl group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]" />
        
        {/* 顶部导航 */}
        <header 
          ref={headerRef}
          className="flex h-14 items-center justify-between px-3 cursor-pointer sm:h-16 sm:px-6 lg:px-8"
        >
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <Link href="/" className="group flex items-center relative z-10 transition-transform duration-300 active:scale-95">
              <span className="text-base sm:text-lg lg:text-xl font-medium tracking-[0.12em] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
                Alkaid<span className="font-light text-zinc-500 dark:text-zinc-400 ml-[1px]">START</span>
              </span>
            </Link>
            
            <nav ref={navRef} className="hidden items-center gap-3 sm:flex relative">
              {/* GSAP 物理吸附指示器 */}
              <div
                ref={indicatorRef}
                className="absolute inset-y-0 left-0 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10"
                style={{ borderRadius: '0.8rem', opacity: 0 }}
              />
              
              {navItems.map((item) => (
                <div
                  key={item.path}
                  data-path={item.path}
                  className="relative z-10"
                >
                  <Link 
                    href={item.path} 
                    className="group/item ios-26-liquid-nav-item relative flex items-center gap-3 px-5 py-3 text-base font-medium transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <item.icon className="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/item:scale-110" />
                      <span className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/item:-translate-y-0.5">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
            <Search />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-26-liquid-button flex h-8 w-8 items-center justify-center text-gray-600 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:scale-110 duration-300 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </a>
            <button
              className="ios-26-liquid-button flex h-9 w-9 items-center justify-center text-gray-600 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-white active:scale-95 duration-300 sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div 
                className="transition-transform duration-500" 
                style={{ transform: mobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </div>
            </button>
          </div>
        </header>

        {/* 移动端菜单背景遮罩 */}
        <div 
          ref={backdropRef}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
          style={{ display: "none", opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* 移动端菜单列表 */}
        <div
          ref={mobileMenuRef}
          className="ios-26-liquid-mobile-menu absolute left-2 right-2 top-16 flex-col gap-2 rounded-2xl p-3 z-50 sm:left-4 sm:right-4 sm:top-20 sm:gap-3 sm:rounded-3xl sm:p-6"
          style={{ display: "none", opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {navItems.map((item) => {
            const isCurrentPage = pathname === item.path;
            
            return (
              <div key={item.path} className="mobile-item-anim opacity-0">
                <Link
                  href={item.path}
                  className={`group/mob relative flex items-center gap-4 px-6 py-4 text-base font-medium transition-all text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white select-none ${
                    isCurrentPage ? 'border-2 border-primary/50 rounded-2xl' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {/* 背景悬浮态设计 */}
                  <div className="absolute inset-0 rounded-2xl transition-all duration-300 bg-transparent group-hover/mob:bg-white/20 group-hover/mob:backdrop-blur-sm dark:group-hover/mob:bg-white/10" />
                  
                  <div className="relative z-10 p-1 transition-transform duration-300 ease-out group-hover/mob:scale-110 group-hover/mob:rotate-6">
                    <item.icon className="h-6 w-6" />
                  </div>
                  
                  <span className="relative z-10 transition-transform duration-300 ease-out group-hover/mob:translate-x-2">
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}