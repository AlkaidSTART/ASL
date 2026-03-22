import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog-index';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import FloatBackButton from '@/components/blog/FloatBackButton';
import { Suspense } from 'react';

// 定义 MDX 组件
const components = {
  // 可以在这里添加自定义 MDX 组件
};

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

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
      {/* 沉浸式侧边返回按钮（滚动时隐藏） */}
      <FloatBackButton />

      <article className="flex flex-col items-center px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <div className="w-full max-w-[65ch] md:max-w-3xl lg:max-w-4xl mx-auto">
          {/* 文章头部 */}
          <header className="mb-12 sm:mb-16 text-center">
            <h1 className="mb-6 break-words text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:mb-8 sm:text-5xl lg:text-6xl dark:text-zinc-100">
              {post.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium tracking-wider text-zinc-500 dark:text-zinc-400 sm:mb-6 sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              <span className="hidden sm:inline opacity-30">•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>

              <span className="hidden sm:inline opacity-30">•</span>

              <span>{post.wordCount} 字</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-zinc-200/60 bg-zinc-50/50 px-3 py-1 text-xs font-medium tracking-widest uppercase text-zinc-600 transition-all hover:bg-zinc-100/80 hover:shadow-sm sm:px-4 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                  >
                    <Tag className="h-3 w-3 mr-1.5 opacity-70" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {post.description && (
              <p className="mx-auto mt-8 sm:mt-10 max-w-2xl px-2 font-light text-lg text-zinc-500 sm:px-0 sm:text-xl dark:text-zinc-400 leading-relaxed">
                {post.description}
              </p>
            )}
          </header>

          {/* 文章内容 - 沉浸式无边框文本主体 */}
          <div className="mb-12 sm:mb-20 overflow-hidden rounded-3xl bg-white/30 p-6 sm:p-10 backdrop-blur-md border border-zinc-100 dark:border-zinc-800/30 dark:bg-zinc-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.01)] relative z-10">
            <div className="prose prose-zinc prose-base mx-auto max-w-[65ch] overflow-x-auto selection:bg-zinc-200/70 selection:text-zinc-900 sm:prose-lg dark:prose-invert dark:selection:bg-zinc-800/80 dark:selection:text-zinc-100 prose-p:leading-loose prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-a:font-medium prose-a:text-zinc-800 prose-a:decoration-zinc-300 prose-a:underline-offset-4 hover:prose-a:text-black dark:prose-a:text-zinc-200 dark:prose-a:decoration-zinc-600 dark:hover:prose-a:text-white prose-code:rounded-md prose-code:bg-zinc-100/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:text-zinc-800 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800/60 dark:prose-code:text-zinc-200 prose-pre:border prose-pre:border-zinc-200/50 prose-pre:bg-zinc-50 prose-pre:text-zinc-800 prose-pre:shadow-sm dark:prose-pre:text-zinc-200 dark:prose-pre:border-zinc-800/80 dark:prose-pre:bg-zinc-900/80 dark:prose-pre:shadow-none [&_pre_code]:text-inherit prose-blockquote:border-l-zinc-300 prose-blockquote:bg-zinc-50/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:font-normal prose-blockquote:text-zinc-500 dark:prose-blockquote:border-zinc-700 dark:prose-blockquote:bg-zinc-800/30 dark:prose-blockquote:text-zinc-400 prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800 prose-img:rounded-2xl prose-img:shadow-md dark:prose-img:shadow-none">
              <Suspense fallback={<div className="h-40 flex items-center justify-center text-zinc-500 animate-pulse">Loading content...</div>}>
                <MDXRemote source={mdxContent} components={components} />
              </Suspense>
            </div>
          </div>

          {/* 文章底部 */}
          <footer className="border-t border-zinc-200/80 pt-8 dark:border-zinc-800/80 sm:pt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-2xl border border-zinc-200/50 bg-white/40 px-5 py-2.5 text-sm font-medium tracking-wide text-zinc-700 backdrop-blur-md transition-all duration-300 hover:-translate-x-1 hover:bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  <span className="lang-zh">返回博客</span>
                  <span className="lang-en">Back to Blog</span>
                </span>
              </Link>

              <div className="text-center font-mono text-xs text-zinc-400 dark:text-zinc-500 sm:text-right">
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
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

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
