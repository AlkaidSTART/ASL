"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cat } from "lucide-react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const charRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 动画路线：从左边缘走到右边缘，再走回来，并且转身
      const width = globalThis.window ? window.innerWidth : 500;
      // 预估图标宽度约为 24pxß
      const distance = width - 40; 
      
      const tl = gsap.timeline({ repeat: -1 });

      // 向右走：小猫慢慢走，同时加入非常轻微的上下跳动模拟脚步
      tl.to(charRef.current, {
        x: distance,
        duration: 18, // 小猫走慢一点
        ease: "none",
        onStart: () => {
          if (charRef.current) gsap.set(charRef.current, { scaleX: -1 });
        }
      })
      // 向左走回来
      .to(charRef.current, {
        x: 0,
        duration: 18,
        ease: "none",
        onStart: () => {
          if (charRef.current) gsap.set(charRef.current, { scaleX: 1 });
        }
      });
      
      // 添加一个独立的心跳/脚步起伏动画
      gsap.to(charRef.current, {
        y: -3, // 稍微往上跳3px
        duration: 0.3,
        yoyo: true, // 弹回去
        repeat: -1, // 无限重复
        ease: "sine.inOut"
      });

    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative border-t border-gray-200/50 bg-[rgb(240,232,216)] py-8 text-center backdrop-blur-sm dark:border-gray-800/50 dark:bg-[rgb(248,240,224)]" ref={footerRef}>
      {/* 相对 footer 定位的桌宠小人，放在边界之上 */}
      {/* 调整 top 让小猫踩在边框上，pointer-events-none 防止遮挡点击 */}
      <div 
        ref={charRef}
        className="absolute left-0 text-gray-500/80 dark:text-gray-400/80 pointer-events-none"
        style={{ top: "-23px", zIndex: 10, willChange: "transform" }}
      >
        <Cat size={22} strokeWidth={1.5} />
      </div>
      
      <div className="container mx-auto px-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
          &copy; {new Date().getFullYear()} AlkaidLight 
          <span className="mx-2">·</span> 
           Hosted on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
