import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPosts, getAllTags } from '@/lib/blog-index';
import { PostList } from '@/components/PostList';

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回主页按钮 */}
      <div
        className="fixed left-4 z-50 sm:left-6 sm:top-6"
        style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}
      >
        <Link 
          href="/" 
          className="ios-26-liquid-button flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">
            <span className="lang-zh">返回主页</span>
            <span className="lang-en">Home</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
        <p className="mb-10 mx-auto max-w-2xl px-2 font-serif text-lg italic text-stone-500 sm:mt-8 sm:px-0 sm:text-xl dark:text-stone-400">
          <span className="lang-zh">分享技术见解、开发经验和学习心得</span>
          <span className="lang-en">Sharing technical insights, dev experiences, and learning notes</span>
        </p>

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <div className="mb-10 w-full max-w-4xl px-1 sm:mb-12 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center">
              <Link
                href="/blog"
                className="ios-26-liquid-button px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap flex-shrink-0"
              >
                <span className="lang-zh">全部文章</span>
                <span className="lang-en">All Posts</span>
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
        <div className="w-full max-w-5xl px-0 sm:px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                <span className="lang-zh">暂无文章</span>
                <span className="lang-en">No posts yet</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                <span className="lang-zh">博客文章正在准备中，敬请期待！</span>
                <span className="lang-en">Articles are being prepared, please look forward to them!</span>
              </p>
            </div>
          ) : (
            <PostList posts={posts} />
          )}
        </div>

        {/* 统计信息 */}
        {posts.length > 0 && (
          <div className="mt-12 w-full max-w-4xl border-t border-gray-200 px-4 pt-8 dark:border-gray-700 sm:mt-16">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2 text-sm sm:text-base">
                <span className="lang-zh">共 {posts.length} 篇文章，{allTags.length} 个标签</span>
                <span className="lang-en">Total {posts.length} posts, {allTags.length} tags</span>
              </p>
              <p className="text-sm">
                <span className="lang-zh">总字数: {posts.reduce((sum, post) => sum + post.wordCount, 0).toLocaleString()} 字</span>
                <span className="lang-en">Total words: {posts.reduce((sum, post) => sum + post.wordCount, 0).toLocaleString()}</span>
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
