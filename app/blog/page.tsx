import { getSortedPostsData } from '@/lib/posts';
import { PostList } from '@/components/PostList';

export default function BlogIndex() {
  const posts = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-12 sm:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white sm:text-5xl">
          <span className="lang-en">Latest Posts</span>
          <span className="lang-zh">最新文章</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          <span className="lang-en">Thoughts, tutorials, and insights on Vibe Coding and AI.</span>
          <span className="lang-zh">关于 Vibe Coding 和 AI 的思考、教程与见解。</span>
        </p>
      </div>
      
      <PostList posts={posts} />
    </div>
  );
}
