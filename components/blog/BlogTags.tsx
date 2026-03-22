'use client';

import { useSearchStore } from '@/stores/searchStore';

export function BlogTags({ tags }: { tags: string[] }) {
  const { openWithQuery } = useSearchStore();

  return (
    <div className="mb-10 w-full max-w-4xl px-1 sm:mb-12 sm:px-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
        <button
          onClick={() => openWithQuery('')}
          className="ios-26-liquid-button px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap flex-shrink-0"
        >
          <span className="lang-zh">全部文章</span>
          <span className="lang-en">All Posts</span>
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => openWithQuery(tag)}
            className="ios-26-liquid-button px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap flex-shrink-0"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}