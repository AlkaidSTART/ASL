'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-[rgb(248,240,224)] px-4 text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <img
            src={`${basePath}/avatorone.jpg`}
            alt="AlkaidLight"
            className="h-32 w-32 rounded-full border-4 border-white shadow-2xl"
          />
        </motion.div>

        <h1 className="mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          AlkaidLight
        </h1>

        <p className="mb-10 max-w-2xl text-xl text-gray-600">
          <span className="lang-en block sm:inline">
            Exploring the future of software development with
          </span>{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-bold text-transparent">
            Vibe Coding
          </span>{' '}
          <span className="lang-en block sm:inline">& AI.</span>
          <span className="lang-zh mt-2 block text-lg sm:mt-0">
            用 Vibe Coding 和 AI 探索软件开发的未来。
          </span>
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/blog"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="mr-2 transition-transform group-hover:-translate-x-1">
              Read Blog
            </span>
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-lg hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            GitHub
          </a>
        </div>
      </motion.div>
    </section>
  );
}
