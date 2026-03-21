'use client';

import { useRef } from 'react';
import { type BlogPost as Post } from '@/lib/blog-index';
import { PostCard } from './PostCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function PostList({ posts }: { posts: Post[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      '.post-card-wrapper',
      { y: 60, opacity: 0, rotateX: 5 },
      { 
        y: 0, 
        opacity: 1, 
        rotateX: 0,
        duration: 1, 
        stagger: 0.1, 
        ease: 'power3.out',
        clearProps: 'all' // so it avoids hover conflict later
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 perspective-[1000px]"
    >
      {posts.map((post) => (
        <div className="post-card-wrapper h-full" key={post.slug}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
