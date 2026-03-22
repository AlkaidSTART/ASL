"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Cat } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ctx = gsap.context(() => {
      const cat = charRef.current;
      if (!cat) return;

      // 初始状态：隐藏在下方并隐形
      gsap.set(cat, { y: 15, opacity: 0, rotation: 0 });

      const peekOut = () => {
        // 随机在屏幕范围内选一个 X 坐标 (预留 40px 边距)
        const width = globalThis.window ? window.innerWidth : 800;
        const randomX = Math.random() * (width - 40) + 10;
        
        // 随机朝向：一半概率镜像翻转
        const faceRight = Math.random() > 0.5;
        
        // 重置位置到新的潜伏点
        gsap.set(cat, { 
          x: randomX, 
          scaleX: faceRight ? -1 : 1, 
          y: 15, 
          opacity: 0, 
          rotation: 0 
        });

        const tl = gsap.timeline({
          onComplete: () => {
            // 完全动作结束后，随机等待 4 ~ 10 秒再进行下一次探头，降低突兀感
            gsap.delayedCall(Math.random() * 6 + 4, peekOut);
          }
        });

        // 1. 缓缓探出头
        tl.to(cat, {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        })
        // 2. 停顿发呆，稍微歪一下头
        .to(cat, {
          rotation: faceRight ? 8 : -8,
          duration: 1,
          delay: 1.5,
          ease: "sine.inOut"
        })
        // 3. 把头正回来看一下
        .to(cat, {
          rotation: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "sine.inOut"
        })
        // 4. 悄悄缩回去
        .to(cat, {
          y: 15,
          opacity: 0,
          duration: 1.5,
          delay: 1.5,
          ease: "power2.in"
        });
      };

      // 页面加载后 2 秒，第一次出现
      gsap.delayedCall(2, peekOut);

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative border-t border-gray-200/50 bg-[rgb(240,232,216)] py-8 text-center backdrop-blur-sm dark:border-gray-800/50 dark:bg-[rgb(248,240,224)]" ref={footerRef}>
      {/* 相对 footer 定位的桌宠小人，放在边界之上 */}
      {/* 调整 top 让小猫踩在边框上，pointer-events-none 防止遮挡点击 */}
      <div 
        ref={charRef}
        className="absolute left-0 text-gray-500/70 dark:text-gray-400/70 pointer-events-none"
        style={{ top: "-28px", zIndex: 10, willChange: "transform, opacity" }}
      >
        <Cat size={28} strokeWidth={1.5} />
      </div>
      
      <div className="container mx-auto px-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
          &copy; {new Date().getFullYear()} {mounted ? t('footer', 'copyright') : 'All rights reserved.'}
          <span className="mx-2">·</span> 
           {mounted ? t('footer', 'hostedOn') : 'Hosted on GitHub Pages'}
        </p>
      </div>
    </footer>
  );
}
