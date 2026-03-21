'use client';

import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { type BlogPost as Post } from '@/lib/blog-index';
import { ArrowUpRight, Calendar, Clock, Tag } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  const cardRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    // 整个卡片轻微上浮&发大
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.01,
      duration: 0.5,
      ease: 'power4.out',
    });
    
    // 内容稍微横移，制造错层排版的高级感
    gsap.to(contentRef.current, {
      x: 6,
      duration: 0.5,
      ease: 'power3.out'
    });

    // 箭头淡入并划出
    gsap.to(arrowRef.current, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'back.out(1.5)'
    });
  };
  
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    });

    gsap.to(contentRef.current, {
      x: 0,
      duration: 0.5,
      ease: 'power3.out'
    });

    gsap.to(arrowRef.current, {
      x: -10,
      y: 10,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out'
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col p-6 sm:p-8 overflow-hidden rounded-[24px] bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-500 hover:bg-white/80 dark:hover:bg-zinc-800/80 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-50 rounded-[24px]" prefetch={true} />
      
      {/* Background Gradient Spot on Hover */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-zinc-200/50 dark:bg-zinc-700/50 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-0"></div>

      <div ref={contentRef} className="flex flex-col h-full z-10 relative">
        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} 分钟阅读</span>
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 ml-auto">
              <Tag className="w-3.5 h-3.5 mr-1 hidden sm:block" />
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-600 dark:text-zinc-300 transition-colors duration-300 group-hover:border-zinc-300 dark:group-hover:border-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {post.title}
        </h2>

        <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-light flex-1">
          {post.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/60 pt-5">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-zinc-800 dark:text-zinc-200 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
            Read Article
          </span>
          <div 
            ref={arrowRef} 
            className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 opacity-0 -translate-x-2 translate-y-2 pointer-events-none"
          >
            <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
          </div>
        </div>
      </div>
    </article>
  );
}
