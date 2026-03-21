import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/blog-index';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import FloatBackButton from '@/components/blog/FloatBackButton';

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
            <h1 className="mb-6 break-words text-3xl font-black leading-tight tracking-tighter text-stone-900 sm:mb-8 sm:text-5xl lg:text-6xl dark:text-stone-100">
              {post.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600 dark:text-stone-400 sm:mb-6 sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              <span className="hidden sm:inline">•</span>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>

              <span className="hidden sm:inline">•</span>

              <span>{post.wordCount} 字</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 sm:px-3 sm:text-sm dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/30"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {post.description && (
              <p className="mx-auto mt-6 max-w-2xl px-2 font-serif text-lg italic text-stone-500 sm:mt-8 sm:px-0 sm:text-xl dark:text-stone-400">
                {post.description}
              </p>
            )}
          </header>

          {/* 文章内容 - 沉浸式无边框文本主体 */}
          <div className="mb-12 sm:mb-20 overflow-hidden">
            <div className="prose prose-zinc prose-base mx-auto max-w-[65ch] overflow-x-auto selection:bg-amber-200/70 selection:text-stone-900 sm:prose-lg lg:prose-xl dark:prose-invert dark:selection:bg-amber-900/40 dark:selection:text-stone-100 prose-p:leading-[1.95] prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-stone-900 dark:prose-headings:text-stone-100 prose-strong:text-stone-900 dark:prose-strong:text-stone-100 prose-a:text-amber-700 prose-a:decoration-amber-400/70 prose-a:underline-offset-4 hover:prose-a:text-amber-600 dark:prose-a:text-amber-300 dark:hover:prose-a:text-amber-200 prose-code:rounded prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-stone-800 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-white/10 dark:prose-code:text-stone-200 prose-pre:border prose-pre:border-stone-800/10 prose-pre:bg-[#2a2624] prose-pre:text-stone-200 dark:prose-pre:border-stone-800 dark:prose-pre:bg-[#161412] prose-blockquote:border-l-amber-500 prose-blockquote:font-serif prose-blockquote:text-stone-600 dark:prose-blockquote:text-stone-400 prose-hr:border-stone-300 dark:prose-hr:border-stone-700 prose-img:rounded-2xl prose-img:shadow-sm dark:prose-img:shadow-none">
              <MDXRemote source={mdxContent} components={components} />
            </div>
          </div>

          {/* 文章底部 */}
          <footer className="border-t border-stone-300/80 pt-8 dark:border-stone-800 sm:pt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                href="/blog"
                className="ios-26-liquid-button flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                返回博客
              </Link>

              <div className="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-right sm:text-sm">
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
