import Comments from '@/components/Comments';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export default async function BlogPost(props: { params: Params }) {
  const params = await props.params;
  const { slug } = params;
  const post = getPostData(slug);

  return (
    <article className="container mx-auto px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <time dateTime={post.date} className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
            {post.date}
          </time>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex justify-center gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
          <MDXRemote source={post.content} />
        </div>
        <Comments />
      </div>
    </article>
  );
}
