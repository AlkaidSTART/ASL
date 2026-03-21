'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const headerRef = useRef<HTMLHeadElement>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);
  const { 
    isBlogPost, 
    isAboutPage, 
    isContactPage, 
    setIsBlogPost, 
    setIsAboutPage, 
    setIsContactPage, 
    resetPageStates 
  } = usePageStore();

  // 防抖函数 - 优化性能
  const debouncedUpdateIndicator = useCallback((path: string) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (isUpdatingRef.current || !navRef.current) return;
      
      isUpdatingRef.current = true;
      
      try {
        const targetItem = navRef.current.querySelector(`[data-path="${path}"]`) as HTMLElement;
        if (targetItem) {
          setIndicatorStyle({
            left: targetItem.offsetLeft,
            width: targetItem.offsetWidth
          });
        }
      } catch (error) {
        console.warn('指示器位置更新失败:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    }, 16); // 约60fps的更新频率
  }, []);

  // 检测当前页面类型
  useEffect(() => {
    const isBlogArticle = pathname?.startsWith('/blog/') && pathname !== '/blog';
    const isAbout = pathname === '/about';
    const isContact = pathname === '/contact';
    const isBlogList = pathname === '/blog';

    if (isBlogArticle) {
      setIsBlogPost(true);
    } else if (isAbout) {
      setIsAboutPage(true);
    } else if (isContact) {
      setIsContactPage(true);
    } else if (isBlogList) {
      // 博客列表页面，重置状态以显示header
      resetPageStates();
    } else {
      // 在主页或其他页面时重置状态
      resetPageStates();
    }
  }, [pathname, setIsBlogPost, setIsAboutPage, setIsContactPage, resetPageStates]);

  // 更新指示器位置和宽度 - 带防抖和错误处理
  useEffect(() => {
    if (pathname) {
      debouncedUpdateIndicator(pathname);
    }
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [pathname, debouncedUpdateIndicator]);

  // 确保指示器在组件挂载时正确显示当前页面
  useEffect(() => {
    if (pathname && navRef.current) {
      // 延迟执行以确保DOM完全渲染
      setTimeout(() => {
        debouncedUpdateIndicator(pathname);
      }, 100);
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 路由变化时关闭移动菜单
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    handleRouteChange();
  }, [pathname]);

  // 移动端菜单打开时禁止背景滚动
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // 如果在博客文章、关于或联系页面，不显示header
  if (isBlogPost || isAboutPage || isContactPage) {
    return null;
  }

  const handleMouseEnter = (path: string) => {
    if (isUpdatingRef.current) return;
    setHoveredPath(path);
    debouncedUpdateIndicator(path);
  };

  const handleMouseLeave = () => {
    if (isUpdatingRef.current) return;
    setHoveredPath(null);
    if (pathname) {
      debouncedUpdateIndicator(pathname);
    }
  };

  return (
    <div 
      className="fixed left-1/2 z-50 box-border w-full max-w-6xl -translate-x-1/2 px-2 sm:top-4 sm:px-4"
      style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="group relative"
        animate={{ 
          y: isHovered ? 20 : 0  // 向下偏移20px（约1/3的header高度）
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80,   // 柔和的spring动画
          damping: 12,     
          mass: 1.2        
        }}
      >
        {/* iOS 26液态玻璃背景效果 - 保持静态 */}
        <div 
          className="ios-26-liquid-glass-backdrop absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-[60px] backdrop-saturate-200 dark:border-white/15 dark:from-black/30 dark:to-black/10"
        />
        
        {/* 增强的液态玻璃效果 - 保持静态 */}
        <div className="ios-26-liquid-glow absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl" />
        <div className="ios-26-liquid-highlight absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl" />
        <div className="ios-26-liquid-shadow absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl" />
        
        {/* 动态光效 - 保持静态 */}
        <div className="ios-26-liquid-shine absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100" />

        <motion.header 
          ref={headerRef}
          className="ios-26-liquid-glass flex h-14 items-center justify-between px-3 cursor-pointer sm:h-16 sm:px-6 lg:px-8"
          animate={{ 
            scale: isHovered ? 1.01 : 1,  // 减少放大比例到1%，更微妙
            y: isHovered ? -2 : 0         // 轻微向上偏移，与外层向下偏移形成对比
          }}
          transition={{ 
            type: "spring", 
            stiffness: 140,  // 稍微增加刚性，让内部动画更紧致
            damping: 20,     // 增加阻尼，减少震荡
            mass: 0.6        // 减少质量，让内部响应更快
          }}
        >
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-1.5 text-base font-bold tracking-tight sm:gap-2 sm:text-lg lg:text-xl">
              <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                AlkaidSTART
              </span>
            </Link>
            
            <nav ref={navRef} className="hidden items-center gap-3 sm:flex relative">
              {/* 液态玻璃风格的指示器 */}
              <motion.div
                className="absolute inset-y-0 rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/40 dark:border-white/20 shadow-lg"
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5
                }}
              />
              
              {navItems.map((item) => {
                const isItemHovered = hoveredPath === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    data-path={item.path}
                    className="relative z-10"
                    animate={{
                      y: isHovered ? -1 : 0  // 导航项轻微向上移动
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                      mass: 0.5
                    }}
                  >
                    <Link 
                      href={item.path} 
                      className={`ios-26-liquid-nav-item relative flex items-center gap-3 px-5 py-3 text-base font-medium transition-all text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white`}
                      onMouseEnter={() => handleMouseEnter(item.path)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* 图标和文字 */}
                      <span className="relative z-10 flex items-center gap-3">
                        <motion.span
                          animate={{
                            scale: isItemHovered ? 1.1 : 1
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 30
                          }}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.span>
                        <motion.span
                          animate={{
                            y: isItemHovered ? -1 : 0
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 30
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>
          
          <motion.div 
            className="flex items-center gap-1.5 sm:gap-3"
            animate={{
              y: isHovered ? -1 : 0  // 右侧元素轻微向上移动
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 25,
              mass: 0.5
            }}
          >
            <Search />
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ios-26-liquid-button flex h-8 w-8 items-center justify-center text-gray-600 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-white duration-300 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
              animate={{
                scale: isHovered ? 1.05 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30
              }}
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </motion.a>
            <motion.button
              type="button"
              className="ios-26-liquid-button flex h-9 w-9 items-center justify-center text-gray-600 transition-all hover:text-gray-900 dark:text-gray-300 dark:hover:text-white duration-300 sm:hidden relative overflow-hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              animate={{
                scale: isHovered ? 1.05 : 1,
                rotate: mobileMenuOpen ? 90 : 0
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.header>
        
        {/* 移动端菜单遮罩层 */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                ease: [0.23, 1, 0.32, 1] // 使用更流畅的缓动函数
              }}
              className="ios-26-liquid-mobile-menu absolute left-2 right-2 top-16 flex flex-col gap-2 rounded-2xl p-3 z-50 sm:left-4 sm:right-4 sm:top-20 sm:gap-3 sm:rounded-3xl sm:p-6"
              style={{ transformOrigin: "top center" }}
              onClick={(e) => e.stopPropagation()} // 防止点击菜单内部关闭菜单
            >
              {navItems.map((item, index) => {
                const isItemHovered = hoveredPath === item.path;
                const isCurrentPage = pathname === item.path;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1, // 错开动画时间
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      href={item.path}
                      className={`ios-26-liquid-nav-item relative flex items-center gap-4 px-6 py-4 text-base font-medium transition-all text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white select-none ${
                        isCurrentPage ? 'border-2 border-blue-500 dark:border-blue-400 rounded-2xl' : ''
                      }`}
                      onMouseEnter={() => handleMouseEnter(item.path)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ minHeight: '56px' }} // 确保最小触摸区域
                    >
                      {/* 当前页面指示边框 */}
                      {isCurrentPage && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-blue-500 dark:border-blue-400"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      {/* 液态玻璃hover效果 */}
                      <motion.div 
                        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                          isItemHovered && !isCurrentPage
                            ? 'bg-white/30 dark:bg-white/15 shadow-xl scale-105 backdrop-blur-sm border border-white/40 dark:border-white/20' 
                            : 'bg-transparent scale-100'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      />
                      
                      {/* 光效层 */}
                      {isItemHovered && !isCurrentPage && (
                        <motion.div 
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                      
                      {/* 图标动画 */}
                      <motion.div
                        className="relative z-10"
                        animate={{
                          scale: isItemHovered ? 1.15 : 1,
                          rotate: isItemHovered ? 5 : 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                      >
                        <item.icon className="h-6 w-6" />
                      </motion.div>
                      
                      {/* 文字动画 */}
                      <motion.span 
                        className="relative z-10"
                        animate={{
                          x: isItemHovered ? 4 : 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                      >
                        {item.label}
                      </motion.span>
                      
                      {/* 点击波纹效果 */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/20 dark:bg-white/10"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 2, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ pointerEvents: 'none' }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}