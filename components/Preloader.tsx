'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePageStore } from '@/stores/pageStore';

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const setAppLoaded = usePageStore((state) => state.setAppLoaded);
  const isAppLoaded = usePageStore((state) => state.isAppLoaded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mounted || isAppLoaded) return;

    // 为了防止页面滚动
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        setAppLoaded(true);
        document.body.style.overflow = '';
      }
    });

    // 1. 文字出现并稍微悬留
    tl.fromTo(
      textRef.current,
      { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }
    )
    // 2. 文字放大消散
    .to(
      textRef.current,
      { opacity: 0, scale: 1.5, filter: 'blur(10px)', duration: 0.8, ease: 'power2.in' },
      '+=0.2'
    )
    // 3. 背景模糊褪去 (通过 opacity 淡出，性能最好且同样有由于 opacity 降低带来的景深对焦感)
    .to(
      blurOverlayRef.current,
      { 
        opacity: 0,
        duration: 1.2, 
        ease: 'power3.inOut' 
      },
      '-=0.4'
    )
    // 4. 隐藏整个容器
    .set(containerRef.current, { display: 'none' });

  }, { scope: containerRef, dependencies: [mounted, isAppLoaded] });

  // 如果已经加载过，或者是服务端渲染期间，为了避免闪烁，先渲染一个空状态或者null
  if (!mounted || isAppLoaded) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      {/* 模糊遮罩层：高强度的霜化模糊 + 微微的背景色让底图隐约可见 */}
      <div 
        ref={blurOverlayRef}
        className="absolute inset-0 bg-white/30 dark:bg-black/30"
        style={{ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      />
      
      {/* 居中文字（IP标识） */}
      <div 
        ref={textRef}
        className="relative z-10 flex flex-col items-center justify-center font-bold tracking-widest text-zinc-900 dark:text-zinc-100"
      >
        <span className="text-4xl sm:text-6xl md:text-8xl flex items-center" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          Alkaid<span className="font-light tracking-[0.05em] ml-1 bg-gradient-to-r from-zinc-500 to-zinc-400 bg-clip-text text-transparent">START</span>
        </span>
        <span className="mt-4 text-xs font-light tracking-[0.3em] opacity-70">
          DESIGN & CODE
        </span>
      </div>
    </div>
  );
}