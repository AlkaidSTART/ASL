import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog-index';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

// 定义 MDX 组件
const components = {
  // 可以在这里添加自定义 MDX 组件
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 将内容转换为 MDX 格式
  const mdxContent = post.content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '```$1\n$2\n```')
    .replace(/# (.*)/g, '# $1')
    .replace(/\n\n/g, '\n\n');

  return (
    <div className="min-h-screen">
      {/* 液态玻璃风格的返回按钮 */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/blog"
          className="ios-26-liquid-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          返回博客
        </Link>
      </div>

      <article className="flex flex-col items-center py-24 px-4">
        <div className="w-full max-w-4xl">
          {/* 文章头部 */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>

              <span>•</span>

              <span>{post.wordCount} 字</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {post.description && (
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 italic max-w-2xl mx-auto">
                {post.description}
              </p>
            )}
          </header>

          {/* 文章内容 - 液态玻璃容器 */}
          <div className="ios-26-liquid-glass rounded-xl p-8 mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote source={mdxContent} components={components} />
            </div>
          </div>

          {/* 文章底部 */}
          <footer className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Link
                href="/blog"
                className="ios-26-liquid-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                返回博客
              </Link>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                最后更新: {new Date(post.date).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}

// 生成页面元数据
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: '文章未找到',
      description: '请求的博文不存在'
    };
  }

  return {
    title: post.title,
    description: post.description || `${post.title} - 技术博客文章`,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}
