'use client';

import { useEffect, useState, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

declare global {
  interface Window {
    pagefind: {
      search: (query: string) => Promise<{
        results: Array<{
          data: () => Promise<{
            url: string;
            meta: {
              title: string;
            };
            excerpt: string;
          }>;
        }>;
      }>;
    };
  }
}

export default function Search() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    url: string;
    meta: {
      title: string;
    };
    excerpt: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadPagefind() {
      // Only load in production or if file exists
      if (typeof window !== 'undefined' && typeof window.pagefind === 'undefined') {
        try {
          const pagefind = await import(/* webpackIgnore: true */ `${basePath}/pagefind/pagefind.js`);
          window.pagefind = pagefind;
        } catch {
          // Silently fail in dev mode if not available
          console.log('Pagefind search not available (dev mode?)');
        }
      }
    }
    loadPagefind();
  }, [basePath]);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (value && window.pagefind) {
      setLoading(true);
      try {
        const search = await window.pagefind.search(value);
        const data = await Promise.all(search.results.map((r) => r.data()));
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  }

  // 移动端搜索相关函数
  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (window.innerWidth >= 640) {
          setIsFocused(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* 桌面端搜索 */}
      <div ref={searchContainerRef} className="relative hidden h-10 w-56 md:block lg:w-64">
        {/* 液态玻璃搜索框 */}
        <div className={`ios-26-liquid-search absolute inset-0 rounded-full transition-all duration-300 overflow-hidden ${
          isFocused 
            ? 'scale-105 shadow-xl' 
            : 'hover:scale-102 hover:shadow-lg'
        }`}>
          <div className="absolute inset-0 bg-white/30 dark:bg-white/15 backdrop-blur-sm border border-white/40 dark:border-white/20 transition-all duration-300" />
          
          {/* 光效层 */}
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />
          )}
          
          <div className="relative flex items-center w-full h-full">
            <SearchIcon className="absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索..."
              value={query}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full rounded-full bg-transparent pl-10 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            />
            {loading && (
              <div className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
            )}
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-1.5rem))] max-h-96 overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-black/80 md:w-[min(26rem,calc(100vw-2rem))]">
            <div className="max-h-96 overflow-y-auto p-2">
              {results.map((result, idx) => (
                <a
                  key={idx}
                  href={result.url}
                  className="block rounded-xl px-4 py-3 hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-200"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">{result.meta.title}</h3>
                  <p 
                    className="mt-1 text-xs text-gray-600 line-clamp-2 dark:text-gray-400" 
                    dangerouslySetInnerHTML={{ __html: result.excerpt }} 
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 移动端搜索 */}
      <div className="sm:hidden">
        {/* 移动端搜索按钮 */}
        <button
          onClick={openMobileSearch}
          className="ios-26-liquid-search relative h-10 w-10 rounded-full transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-lg active:scale-95"
          aria-label="搜索"
        >
          <div className="absolute inset-0 bg-white/30 dark:bg-white/15 backdrop-blur-sm border border-white/40 dark:border-white/20" />
          <div className="relative flex items-center justify-center w-full h-full">
            <SearchIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
        </button>

        {/* 移动端搜索模态框 */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeMobileSearch}>
            <div 
              className="absolute inset-x-3 mx-auto max-w-2xl sm:inset-x-4 sm:top-20"
              style={{ top: 'calc(env(safe-area-inset-top) + 5rem)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 搜索输入框 */}
              <div className={`ios-26-liquid-search relative rounded-2xl transition-all duration-300 overflow-hidden ${
                isFocused ? 'scale-105 shadow-xl' : 'hover:scale-102 hover:shadow-lg'
              }`}>
                <div className="absolute inset-0 bg-white/30 dark:bg-white/15 backdrop-blur-sm border border-white/40 dark:border-white/20" />
                
                {/* 光效层 */}
                {isFocused && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />
                )}
                
                <div className="relative flex items-center w-full h-14">
                  <SearchIcon className="absolute left-4 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="搜索文章..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full h-full rounded-2xl bg-transparent pl-12 pr-12 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={closeMobileSearch}
                    className="absolute right-4 h-6 w-6 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label="关闭搜索"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {loading && (
                    <div className="absolute right-10 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
                  )}
                </div>
              </div>

              {/* 搜索结果 */}
              {results.length > 0 && (
                <div className="mt-3 max-h-[60vh] overflow-hidden rounded-2xl border border-white/30 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl dark:border-white/15">
                  <div className="max-h-[60vh] overflow-y-auto p-3">
                    {results.map((result, idx) => (
                      <a
                        key={idx}
                        href={result.url}
                        onClick={closeMobileSearch}
                        className="block rounded-xl px-4 py-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors duration-200 mb-2 last:mb-0"
                      >
                        <h3 className="font-medium text-gray-900 dark:text-white text-base">{result.meta.title}</h3>
                        <p 
                          className="mt-2 text-sm text-gray-600 line-clamp-3 dark:text-gray-400" 
                          dangerouslySetInnerHTML={{ __html: result.excerpt }} 
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 无结果提示 */}
              {query && results.length === 0 && !loading && (
                <div className="mt-3 rounded-2xl border border-white/30 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl dark:border-white/15 p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">未找到相关结果</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}