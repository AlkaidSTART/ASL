import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts, getAllTags } from '@/lib/blog-index';

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回主页按钮 */}
      <div className="fixed left-4 top-[max(1rem,env(safe-area-inset-top))] z-50 sm:left-6 sm:top-6">
        <Link 
          href="/" 
          className="ios-26-liquid-button flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">返回主页</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        {/* 页面标题 */}
        <h1 className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          博客
        </h1>
        
        <p className="mb-10 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg lg:text-xl">
          分享技术见解、开发经验和学习心得
        </p>

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="mb-10 w-full max-w-4xl px-1 sm:mb-12 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
              <Link
                href="/blog"
                className="ios-26-liquid-button px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap flex-shrink-0"
              >
                全部文章
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="ios-26-liquid-button px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap flex-shrink-0"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 文章列表 */}
        <div className="w-full max-w-4xl space-y-6 px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                暂无文章
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                博客文章正在准备中，敬请期待！
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="ios-26-liquid-glass group rounded-xl p-4 text-left transition-all duration-300 sm:p-6 md:hover:scale-[1.02]"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm sm:text-base">
                      {post.description}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{post.readingTime} 分钟阅读</span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4 flex-shrink-0" />
                        <span>{post.tags.length} 个标签</span>
                      </div>
                    )}
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </article>
            ))
          )}
        </div>

        {/* 统计信息 */}
        {posts.length > 0 && (
          <div className="mt-12 w-full max-w-4xl border-t border-gray-200 px-4 pt-8 dark:border-gray-700 sm:mt-16">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2 text-sm sm:text-base">
                共 {posts.length} 篇文章，{allTags.length} 个标签
              </p>
              <p className="text-sm">
                总字数: {posts.reduce((sum, post) => sum + post.wordCount, 0).toLocaleString()} 字
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: '技术博客 - AlkaidLight',
  description: '分享技术见解、开发经验和学习心得的技术博客',
  keywords: '技术博客, 前端开发, Next.js, TypeScript, React',
};
