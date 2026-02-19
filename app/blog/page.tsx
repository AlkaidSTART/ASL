import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function BlogIndex() {
  const posts = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-8">
      <h1 className="mb-12 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        Latest Posts
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <time dateTime={post.date} className="text-sm text-gray-500 dark:text-gray-400">
                  {post.date}
                </time>
                <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {post.tags[0]}
                </span>
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              <p className="line-clamp-3 text-gray-600 dark:text-gray-300">
                {post.description}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
