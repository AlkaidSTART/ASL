'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Smartphone, Laptop, Monitor, Tablet } from 'lucide-react';
import { usePageStore } from '@/stores/pageStore';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const marqueeRef1 = useRef<HTMLDivElement>(null);
  const marqueeRef2 = useRef<HTMLDivElement>(null);
  const leftDecorRef = useRef<HTMLDivElement>(null);
  const rightDecorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Base Hero Animation
    tl.fromTo(
      glowRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 2.5, ease: 'power2.out' }
    )
    .fromTo(
      '.hero-avatar',
      { scale: 0.8, opacity: 0, filter: 'blur(15px)', y: 30 },
      { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.8, clearProps: 'filter' },
      "-=2.2"
    )
    .fromTo(
      '.hero-title-word',
      { y: '120%', rotateZ: 4, opacity: 0 },
      { y: '0%', rotateZ: 0, opacity: 1, duration: 1.2 },
      "-=1.6"
    )
    .fromTo(
      '.hero-desc-line',
      { y: '120%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 1, stagger: 0.15 },
      "-=1.0"
    )
    .fromTo(
      '.hero-btn',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
      "-=0.8"
    )
    // Marquee & Modules enter
    .fromTo(
      ['.hero-marquee', '.side-decor'],
      { opacity: 0, filter: 'blur(10px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1.5, stagger: 0.2 },
      "-=1"
    );

    // Continuous Breathing Glow
    gsap.to(glowRef.current, {
      scale: 1.15,
      opacity: 0.5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Left and Right Decor Floating Animation
    gsap.to('.float-slow', {
      y: '15px',
      rotationZ: 2,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.5
    });

    gsap.to('.float-fast', {
      y: '-20px',
      rotationZ: -3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.4
    });

    // Infinite Marquees
    if (marqueeRef1.current && marqueeRef2.current) {
      gsap.to(marqueeRef1.current, {
        x: '-50%',
        ease: 'none',
        duration: 20,
        repeat: -1
      });
      gsap.to(marqueeRef2.current, {
        x: '50%',
        ease: 'none',
        duration: 25,
        repeat: -1,
        // start offset to make it move right
        onStart: () => gsap.set(marqueeRef2.current, { x: '-50%' })
      });
    }

  }, { scope: container });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!container.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(glowRef.current, {
        x: x,
        y: y,
        duration: 1.5,
        ease: 'power2.out'
      });

      gsap.to('.hero-parallax-fg', {
        x: -x * 0.5,
        y: -y * 0.5,
        duration: 1.5,
        ease: 'power2.out'
      });

      // Left Decors Parallax (Deep depth)
      gsap.to(leftDecorRef.current, {
        x: -x * 1.5,
        y: -y * 1.5,
        duration: 2,
        ease: 'power2.out'
      });
      
      // Right Decors Parallax (Deep depth)
      gsap.to(rightDecorRef.current, {
        x: x * 1.5,
        y: y * 1.5,
        duration: 2,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const techStack = [
    "AI Driven", "Vibe Coding", "Next.js", "React", "GSAP", "Tailwind CSS", 
    "TypeScript", "Node.js", "AGI Exploration", "Minimalist Design"
  ];

  return (
    <section 
      ref={container}
      className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 text-center"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* ======= Left Side Decors: Typing Code Fragments ======= */}
      <div 
        ref={leftDecorRef}
        className="side-decor hidden lg:block absolute left-8 top-1/4 bottom-1/4 w-64 pointer-events-none z-0"
      >
        <div className="relative w-full h-full opacity-[0.35] text-left font-mono text-[11px] leading-relaxed text-gray-800 drop-shadow-sm">
          <div className="float-slow absolute top-[5%] left-[5%]">
            <pre><code>{`const init = async () => {\n  await connect();\n  return [200, "OK"];\n};`}</code></pre>
          </div>
          <div className="float-fast absolute top-[40%] left-[-10%]">
            <pre><code>{`export type AI = {\n  model: string;\n  tokens: number;\n  vibe: "high";\n};`}</code></pre>
          </div>
          <div className="float-slow absolute bottom-[15%] left-[10%]">
            <pre><code>{`function vibe() {\n  while(alive) {\n    code();\n  }\n}`}</code></pre>
          </div>
        </div>
      </div>

      {/* ======= Right Side Decors: Scattered Devices ======= */}
      <div 
        ref={rightDecorRef}
        className="side-decor hidden lg:block absolute right-12 top-1/4 bottom-1/4 w-64 z-0 hero-devices"
      >
        <div className="relative w-full h-full text-gray-800 dark:text-gray-200 opacity-60">
          <div className="float-fast absolute top-[20%] right-[15%] pointer-events-auto">
            <Monitor className="w-16 h-16 transition-transform duration-300 hover:scale-110 hover:text-blue-500 hover:drop-shadow-lg" strokeWidth={1.5} />
          </div>
          <div className="float-slow absolute top-[35%] right-[40%] pointer-events-auto">
            <Laptop className="w-12 h-12 transition-transform duration-300 hover:scale-110 hover:text-purple-500 hover:drop-shadow-lg" strokeWidth={1.5} />
          </div>
          <div className="float-fast absolute top-[50%] right-[15%] pointer-events-auto">
            <Tablet className="w-10 h-10 transition-transform duration-300 hover:scale-110 hover:text-pink-500 hover:drop-shadow-lg" strokeWidth={1.5} />
          </div>
          <div className="float-slow absolute top-[60%] right-[35%] pointer-events-auto">
            <Smartphone className="w-8 h-8 transition-transform duration-300 hover:scale-110 hover:text-green-500 hover:drop-shadow-lg" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div 
        ref={glowRef}
        className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[300px] w-[300px] lg:h-[500px] lg:w-[500px] rounded-full bg-orange-900/10 blur-[100px] lg:blur-[140px]"
      ></div>

      <div className="hero-parallax-fg relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-10">
        
        {/* Core Hero Content */}
        <div className="hero-avatar mb-10 sm:mb-12 flex justify-center">
          <Image
            src={`${basePath}/me_vectorized.svg`}
            alt="AlkaidLight"
            width={128}
            height={128}
            priority
            className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full border border-black/5 shadow-xl transition-transform duration-700 hover:scale-105"
          />
        </div>

        <div className="overflow-hidden pb-4 mb-4 sm:mb-6 px-2 flex justify-center items-center gap-4">
          <h1 className="hero-title-word inline-block origin-bottom-left text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-800 via-zinc-600 to-zinc-800 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 drop-shadow-sm select-none">
            Alkaid<span className="font-light tracking-[0.05em] ml-1 bg-gradient-to-r from-zinc-500 to-zinc-400 bg-clip-text text-transparent">START</span>
          </h1>
    
        </div>

        {/* Removed missing desc lines, adding them back from previous context */}
       

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full px-4 sm:px-0 mb-16 lg:mb-24">
          <Link
            href="/blog"
            className="hero-btn group relative overflow-hidden inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-sm font-medium tracking-wider text-white transition-all duration-500 hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 focus:outline-none w-full sm:w-auto"
          >
            <div className="absolute inset-0 -translate-x-full transition-transform duration-[1.5s] ease-out group-hover:translate-x-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            <span className="relative mr-2">Explore Blog</span>
            <span className="relative transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="https://github.com/alkaidlight"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn inline-flex items-center justify-center rounded-full border border-gray-900/20 bg-transparent px-8 py-4 text-sm font-medium tracking-wider text-gray-700 transition-all duration-500 hover:border-gray-900/40 hover:bg-gray-900/5 hover:-translate-y-1 hover:shadow-md focus:outline-none w-full sm:w-auto"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* --- Module: Minimalist Pioneer Background Marquee --- */}
      <div className="hero-marquee absolute bottom-8 sm:bottom-12 left-0 right-0 w-full overflow-hidden opacity-40 pointer-events-none select-none z-0">
        <div 
          className="flex whitespace-nowrap gap-8 mb-4 min-w-max" 
          ref={marqueeRef1}
        >
          {/* Double array to ensure smooth infinite scroll */}
          {[...techStack, ...techStack].map((tech, i) => (
            <span key={`t1-${i}`} className="text-3xl sm:text-5xl lg:text-7xl font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.15)] tracking-tighter uppercase">
              {tech}
            </span>
          ))}
        </div>
        <div 
          className="flex whitespace-nowrap gap-8 min-w-max" 
          ref={marqueeRef2}
        >
          {[...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, i) => (
            <span key={`t2-${i}`} className="text-3xl sm:text-5xl lg:text-7xl font-black text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.15)] tracking-tighter uppercase">
              {tech}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
