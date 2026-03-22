'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Search as SearchIcon, X, FileText, Layout, Hash, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from '@/hooks/useTranslation';

import { blogMetadata } from '@/lib/blog-index';

type SearchItem = {
  id: string;
  type: 'module' | 'post' | 'tag';
  title: string;
  url: string;
  description: string;
  tags?: string[];
};

const SITE_MODULES: SearchItem[] = [
  { id: 'm1', type: 'module', title: 'Home 首页', url: '/', description: '前沿探索与博客首屏' },
  { id: 'm2', type: 'module', title: 'About 关于', url: '/about', description: 'AI驱动工作流, 技术栈与历程' },
  { id: 'm3', type: 'module', title: 'Blog 博客文章', url: '/blog', description: '所有技术文章与随笔' },
  { id: 'm4', type: 'module', title: 'Contact 联系', url: '/contact', description: '发送邮件或者直接联系我' },
  { id: 'm5', type: 'module', title: 'Github', url: 'https://github.com/alkaidlight', description: 'Alkaid 的开源仓库' }
];

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => {
    const posts: SearchItem[] = blogMetadata.posts.map((post) => ({
      id: post.slug,
      type: 'post',
      title: post.title,
      url: `/blog/${post.slug}`,
      description: post.description || '阅读全文',
      tags: post.tags,
    }));
    
    const tags: SearchItem[] = blogMetadata.tags.map((tag) => ({
      id: `tag-${tag}`,
      type: 'tag',
      title: `${tag}`,
      url: `/blog/tag/${encodeURIComponent(tag)}`,
      description: `查看有关 [${tag}] 标签的所有文章`,
      tags: [tag]
    }));

    const allData: SearchItem[] = [...SITE_MODULES, ...posts, ...tags];

    return new Fuse(allData, {
      keys: [
        { name: 'title', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'tags', weight: 1.5 }
      ],
      threshold: 0.4,
      includeMatches: true,
      ignoreLocation: true,
    });
  }, []);

  const searchResults = useMemo<SearchItem[]>(() => {
    if (!query.trim()) {
      return [];
    }
    return fuse.search(query).map(result => result.item);
  }, [query, fuse]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const closeModal = () => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.inOut' });
      gsap.to(inputContainerRef.current, { 
        opacity: 0, 
        scale: 0.95, 
        duration: 0.2, 
        ease: 'power2.in',
      });
      gsap.to(resultsRef.current, {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          setIsOpen(false);
          setQuery('');
          document.body.style.overflow = '';
        }
      })
    }, containerRef);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }

      if (searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % searchResults.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const item = searchResults[selectedIndex];
          if (item) handleNavigate(item.url);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, selectedIndex]);

  useGSAP(() => {
    if (isOpen && containerRef.current) {
      document.body.style.overflow = 'hidden';
      
      const ctx = gsap.context(() => { 
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(inputContainerRef.current, { opacity: 0, scale: 0.97, y: -10 });
        gsap.set(resultsRef.current, { opacity: 0, height: 0 });

        gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' });
        gsap.to(inputContainerRef.current, { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.25, 
          ease: 'expo.out' 
        });
      }, containerRef);
      
      setTimeout(() => inputRef.current?.focus(), 50);
      
      return () => ctx.revert();
    }
  }, [isOpen]);

  useGSAP(() => {
    if (isOpen) {
      if (searchResults.length > 0) {
        gsap.to(resultsRef.current, {
          opacity: 1,
          height: 'auto',
          duration: 0.3,
          ease: 'expo.out',
          delay: 0.1
        });
      } else {
        gsap.to(resultsRef.current, {
          opacity: 0,
          height: 0,
          duration: 0.2,
          ease: 'expo.in'
        });
      }
    }
  }, [searchResults, isOpen]);

  const handleNavigate = (url: string) => {
    closeModal();
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      router.push(url);
    }
  };

  return (
    <>
      {/* 极简、高级的全局搜索悬浮入口 */}
      <button 
        onClick={handleOpen}
        className="group fixed left-6 bottom-12 z-[90] flex items-center gap-3 rounded-full bg-white/70 px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl ring-1 ring-black/5 transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] focus:outline-none dark:bg-zinc-900/70 dark:ring-white/10 dark:hover:bg-zinc-900/90 dark:hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] sm:bottom-16 sm:left-8"
        aria-label="Search or Ask"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
          <SearchIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-black transition-colors" />
        </div>
        
        <div className="flex flex-col items-start pr-2">
           <span className="text-sm font-medium tracking-wide text-zinc-800 dark:text-zinc-200">
              {mounted ? t('search', 'shortcut') : 'Explore'}
           </span>
           <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
             ⌘ K
           </span>
        </div>
      </button>

      {isOpen && (
        <div ref={containerRef} className="fixed inset-0 z-[100] flex flex-col items-center px-4 pt-[20vh]">
          <div 
            ref={overlayRef}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          <div 
            ref={inputContainerRef}
            className="relative w-full max-w-2xl rounded-2xl bg-white/90 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900/90 dark:ring-white/10 flex flex-col"
          >
            <div className="flex h-16 shrink-0 items-center px-4 bg-transparent">
              <SearchIcon className="mr-3 h-6 w-6 text-zinc-400" />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent text-xl text-black placeholder:text-zinc-400 focus:outline-none dark:text-white appearance-none"
                placeholder={mounted ? t('search', 'placeholder') : 'Search...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              <div className="flex items-center gap-2">
                 {query && (
                    <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-black dark:hover:text-white p-1">
                        <X className="h-4 w-4" />
                    </button>
                 )}
                 <div className="hidden sm:flex items-center gap-1 opacity-50">
                   <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">Esc</kbd>
                 </div>
              </div>
            </div>
          </div>

          <div 
            ref={resultsRef}
            className="relative w-full max-w-2xl mt-4 overflow-hidden rounded-2xl bg-white/90 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl dark:bg-zinc-900/90 dark:ring-white/10"
            style={{ maxHeight: 'calc(80vh - 5rem)' }}
          >
            <div className="overflow-y-auto p-2 scrollbar-hide">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((item, index) => {
                    const isActive = selectedIndex === index;
                    const Icon = item.type === 'module' ? Layout : item.type === 'tag' ? Hash : FileText;
                    
                    return (
                      <div
                        key={`${item.id}-${index}`}
                        onClick={() => handleNavigate(item.url)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                          isActive 
                            ? 'bg-blue-500 text-white shadow-md' 
                            : 'text-zinc-700 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-base font-medium">
                            {item.title}
                          </div>
                          <div className={`truncate text-xs ${isActive ? 'text-blue-100' : 'text-zinc-400'}`}>
                            {item.description}
                          </div>
                        </div>

                        {isActive && <ArrowRight className="h-5 w-5 text-white animate-pulse" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500">
                  <p>{mounted ? t('search', 'noResults', { query }) : `No results found for "${query}"`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
