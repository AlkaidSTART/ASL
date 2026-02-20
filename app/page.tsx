import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 sm:text-7xl">
        <img src="/logo3.png" alt="AlkaidLight" className="h-16" />
      </h1>
      <p className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
        A personal blog built with Next.js, Vibe Coding, and AI.
        Exploring the future of software development.
      </p>
      <div className="flex gap-4">
        <Link
          href="/blog"
          className="rounded-full bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Read Blog
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
