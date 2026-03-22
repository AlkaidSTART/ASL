'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Home, BookOpen, User, Mail, Github, Menu, X, Languages, MapPin } from 'lucide-react';
import { usePageStore } from '@/stores/pageStore';
import { useI18nStore } from '@/stores/i18nStore';

const navItemsList = [
  { path: '/', label: { zh: '首页', en: 'Home' }, icon: Home },
  { path: '/blog', label: { zh: '博客', en: 'Blog' }, icon: BookOpen },
  { path: '/about', label: { zh: '关于', en: 'About' }, icon: User },
  { path: '/contact', label: { zh: '联系', en: 'Contact' }, icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // IP 和距离状态
  const [distanceInfo, setDistanceInfo] = useState<{zh: string, en: string} | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const { language, setLanguage } = useI18nStore();
  const [localTime, setLocalTime] = useState<string>('');
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // 启动本地时间
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString('en-US', { 
        timeZone: 'Asia/Shanghai', 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // i18n 胶囊 GSAP 动画
  useEffect(() => {
    if (!pillRef.current || !isMounted) return;
    gsap.to(pillRef.current, {
      x: language === 'zh' ? 0 : 44, // 按照 44px 位移（根据按钮宽度测算）
      duration: 0.6,
      ease: "elastic.out(1, 0.7)"
    });
  }, [language, isMounted]);

  const MY_LAT = 30.6310;
  const MY_LON = 104.0868; 
  const MY_CITY = "成都";

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

  // 计算地球上两点之间距离的函数 (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 地球半径，单位公里
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceResponse = R * c;
    return Math.round(distanceResponse);
  };

  // Fetch IP and calculate distance
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://api.ip.sb/geoip/');
        const data = await response.json();
        
        if (data && data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude);
          const lon = parseFloat(data.longitude);
          const distance = calculateDistance(MY_LAT, MY_LON, lat, lon);
          
          if (distance < 50) {
            setDistanceInfo({ zh: '我们在同一城市！', en: 'SAME CITY' });
          } else {
            setDistanceInfo({ zh: `${distance.toLocaleString()} KM 外`, en: `${distance.toLocaleString()} KM AWAY` });
          }
        } else {
          setDistanceInfo({ zh: '位置隐藏', en: 'HIDDEN' });
        }
      } catch (error) {
        console.error('Failed to fetch location:', error);
        setDistanceInfo({ zh: '位置未知', en: 'HIDDEN' });
      } finally {
        setIsLocationLoading(false);
      }
    };
    fetchLocation();
  }, [MY_LAT, MY_LON]);

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
              
              {navItemsList.map((item) => (
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
                        {isMounted ? item.label[language] : item.label.zh}
                      </span>
                    </span>
                  </Link>
                </div>
              ))}

              {/* 右侧留白补充：当地时间小组件 */}
              <div className="ml-2 flex items-center gap-3 pl-5 border-l border-zinc-200 dark:border-zinc-800 h-6">
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {isMounted && language === 'zh' ? '当前状态' : 'LOCAL TIME'}
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-wider text-zinc-700 dark:text-zinc-300">
                    {localTime || '00:00:00'}
                  </span>
                </div>
              </div>
            </nav>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
            {/* i18n 语言切换组件 (GSAP 物理胶囊 - 加宽版) */}
            <div className="hidden sm:flex relative items-center rounded-full border border-black/5 bg-black/[0.03] p-1 dark:border-white/5 dark:bg-white/[0.02] hover:bg-black/[0.05] dark:hover:bg-white/[0.04] transition-colors duration-300">
              {/* 移动选中的背景块 */}
              <div 
                ref={pillRef}
                className="absolute left-[3px] top-[4px] bottom-[4px] w-[42px] rounded-full bg-white shadow-sm dark:bg-zinc-800" 
              />
              
              <button
                onClick={() => setLanguage('zh')}
                className={`relative w-[42px] py-1 z-10 flex items-center justify-center rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                  isMounted && language === 'zh' 
                    ? 'text-zinc-900 dark:text-white' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
                aria-label="Switch to Chinese"
              >
                ZH
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`relative w-[42px] py-1 z-10 flex items-center justify-center rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors duration-300 cursor-pointer ${
                  isMounted && language === 'en' 
                    ? 'text-zinc-900 dark:text-white' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>

            {/* 分隔点线 */}
            <div className="hidden sm:block h-3 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 border-r border-dashed" />

            {/* 距离小组件 (高级简约 + 呼吸灯点缀 + 等宽字体) */}
            <div className="hidden sm:flex group/dist relative items-center gap-2 rounded-full border border-transparent px-3 py-1.5 transition-all duration-500 hover:border-black/5 hover:bg-black/[0.02] dark:hover:border-white/5 dark:hover:bg-white/[0.02] cursor-default">
              {/* 状态呼吸灯 */}
              <div className="relative flex h-2 w-2 items-center justify-center">
                {isLocationLoading ? (
                  <span className="absolute h-full w-full animate-ping rounded-full bg-zinc-400 opacity-50"></span>
                ) : (
                  <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20 duration-1000 group-hover/dist:opacity-50"></span>
                )}
                <span className={`relative h-1.5 w-1.5 rounded-full transition-colors duration-500 ${isLocationLoading ? 'bg-zinc-400' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></span>
              </div>
              
              {/* 距离文本 */}
              <span className="font-mono text-[10px] font-medium tracking-widest text-zinc-500 transition-colors duration-500 group-hover/dist:text-zinc-800 dark:text-zinc-400 dark:group-hover/dist:text-zinc-200">
                 {isLocationLoading 
                    ? (isMounted && language === 'zh' ? '定位中...' : 'LOCATING...') 
                    : (distanceInfo ? (isMounted ? distanceInfo[language] : distanceInfo.zh) : '')}
              </span>

              {/* Hover 提示气泡 */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-black/5 bg-white/90 px-2 py-1 text-[9px] font-medium uppercase tracking-wider text-zinc-500 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover/dist:-bottom-9 group-hover/dist:opacity-100 dark:border-white/5 dark:bg-black/90 dark:text-zinc-400">
                {isMounted && language === 'zh' ? `以 ${MY_CITY} 为中心` : `BASED IN ${MY_CITY}`}
              </div>
            </div>

            <a
              href="https://github.com/alkaidlight"
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
          {navItemsList.map((item) => {
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
                    {isMounted ? item.label[language] : item.label.zh}
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