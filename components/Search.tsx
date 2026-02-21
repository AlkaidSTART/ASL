'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    pagefind: any;
  }
}

export default function Search() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPagefind() {
      // Only load in production or if file exists
      if (typeof window !== 'undefined' && typeof window.pagefind === 'undefined') {
        try {
          // Attempt to load pagefind from the root
          // Note: In dev mode, this might fail if pagefind hasn't run.
          // Using a dynamic import with a fixed path.
          // We use a script tag injection approach or just dynamic import if supported.
          // For static export, /pagefind/pagefind.js should be available.
          // @ts-ignore
          const pagefind = await import(/* webpackIgnore: true */ `${basePath}/pagefind/pagefind.js`);
          window.pagefind = pagefind;
        } catch (e) {
          // Silently fail in dev mode if not available
          console.log('Pagefind search not available (dev mode?)');
        }
      }
    }
    loadPagefind();
  }, []);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (value && window.pagefind) {
      setLoading(true);
      const search = await window.pagefind.search(value);
      const data = await Promise.all(search.results.map((r: any) => r.data()));
      setResults(data);
      setLoading(false);
    } else {
      setResults([]);
    }
  }

  return (
    <div className="relative hidden sm:block">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="w-64 rounded-full border border-gray-300 bg-gray-50 px-4 py-1.5 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500"
      />
      {results.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result, idx) => (
              <a
                key={idx}
                href={result.url}
                className="block rounded-md px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{result.meta.title}</h3>
                <p 
                  className="mt-1 text-xs text-gray-500 line-clamp-2 dark:text-gray-400" 
                  dangerouslySetInnerHTML={{ __html: result.excerpt }} 
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
