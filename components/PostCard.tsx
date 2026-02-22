'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { type Post } from '@/lib/posts';

export function PostCard({ post }: { post: Post }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -5 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-blue-400/30 dark:hover:shadow-blue-400/10"
    >
      <div className="mb-4 flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
        <time dateTime={post.date} className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          {post.date}
        </time>
        {post.tags && post.tags.length > 0 && (
          <>
            <span>•</span>
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-800 dark:text-gray-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <h2 className="mb-3 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
          {post.title}
        </Link>
      </h2>

      <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {post.description}
      </p>

      <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
        Read more <span className="ml-1">→</span>
      </div>
    </motion.article>
  );
}
