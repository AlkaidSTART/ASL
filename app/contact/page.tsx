"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X, ArrowLeft } from "lucide-react";
import { usePageStore } from '@/stores/pageStore';

const CONTACTS = [
  {
    name: "EMAIL",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    isLink: true,
  },
  {
    name: "GITHUB",
    value: "@yourgithub",
    href: "https://github.com/yourgithub",
    isLink: true,
  },
  {
    name: "WECHAT",
    value: "your_wechat_id",
    image: "https://via.placeholder.com/300?text=WeChat+QR", // Replace with actual QR
    isLink: false,
  },
  {
    name: "QQ",
    value: "123456789",
    image: "https://via.placeholder.com/300?text=QQ+QR", // Replace with actual QR
    isLink: false,
  }
];

export default function ContactPage() {
  const { setIsContactPage } = usePageStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorImageRef = useRef<HTMLDivElement>(null);
  const qToX = useRef<((value: number) => void) | null>(null);
  const qToY = useRef<((value: number) => void) | null>(null);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    setIsContactPage(true);
    const ctx = gsap.context(() => {
      // Entry animations
      const tl = gsap.timeline();
      
      tl.from(".char-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.05,
      })
      .from(".divider-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
      }, "-=0.8")
      .from(".contact-item-inner", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
      }, "-=0.6");
    }, containerRef);

    // Setup quickTo for cursor image
    if (cursorImageRef.current) {
      gsap.set(cursorImageRef.current, { xPercent: -50, yPercent: -50 });
      qToX.current = gsap.quickTo(cursorImageRef.current, "x", { duration: 0.4, ease: "power3" });
      qToY.current = gsap.quickTo(cursorImageRef.current, "y", { duration: 0.4, ease: "power3" });
    }

    const mouseMove = (e: MouseEvent) => {
      if (qToX.current && qToY.current) {
        qToX.current(e.clientX);
        qToY.current(e.clientY);
      }
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      setIsContactPage(false);
      ctx.revert();
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [setIsContactPage]);

  const handleMouseEnter = (img?: string) => {
    if (img && window.innerWidth > 768) {
      setActiveImage(img);
      gsap.to(cursorImageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.5)"
      });
    }
  };

  const handleMouseLeave = () => {
    setActiveImage(null);
    gsap.to(cursorImageRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in"
    });
  };

  const handleClick = (item: typeof CONTACTS[0]) => {
    if (!item.isLink && item.image) {
      setModalImage(item.image);
    }
  };

  const titleChars = "Let's build something great.".split("");

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-20 px-6 md:px-12 overflow-hidden" ref={containerRef}>
      
      {/* 液态玻璃风格的返回主页按钮 */}
      <div 
        className="fixed left-4 z-50 sm:left-6 sm:top-6"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
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

      {/* Floating Cursor Image */}
      <div 
        ref={cursorImageRef} 
        className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl scale-0 opacity-0 bg-muted flex items-center justify-center"
      >
        {activeImage && (
          <Image 
            src={activeImage} 
            alt="QR Code" 
            fill 
            className="object-cover"
          />
        )}
      </div>

      {/* Modal for Mobile / Clicking */}
      {modalImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm aspect-square bg-muted rounded-2xl overflow-hidden shadow-2xl p-2 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-background/50 rounded-full hover:bg-background/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <Image 
              src={modalImage} 
              alt="QR Code Modal" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-24 uppercase overflow-hidden flex flex-wrap">
          {titleChars.map((char, i) => (
            <span key={i} className="char-title inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div className="flex flex-col w-full">
          <div className="w-full h-px bg-border divider-line origin-left" />
          
          {CONTACTS.map((item) => {
            const content = (
              <div 
                className="group py-8 md:py-12 flex items-center justify-between cursor-pointer w-full"
                onMouseEnter={() => handleMouseEnter(item.image)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(item)}
              >
                <div className="overflow-hidden">
                  <h2 className="contact-item-inner text-4xl md:text-6xl font-bold uppercase transition-colors duration-500 group-hover:text-primary">
                    {item.name}
                  </h2>
                </div>
                
                <div className="overflow-hidden flex items-center justify-center overflow-visible">
                  <div className="contact-item-inner flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-border group-hover:bg-primary group-hover:border-primary transition-colors duration-500">
                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-45 group-hover:scale-125" />
                  </div>
                </div>
              </div>
            );

            return (
              <React.Fragment key={item.name}>
                {item.isLink ? (
                  <Link href={item.href!} target="_blank" rel="noopener noreferrer" className="w-full relative block z-10">
                    {content}
                  </Link>
                ) : (
                  <div className="w-full relative block z-10">
                    {content}
                  </div>
                )}
                <div className="w-full h-px bg-border divider-line origin-left" />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}