'use client';

import { motion } from 'framer-motion';
import { type Post } from '@/lib/posts';
import { PostCard } from './PostCard';

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </motion.div>
  );
}
