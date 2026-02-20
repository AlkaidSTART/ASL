import Link from 'next/link';
import Search from '../Search';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <img src="/logo3.png" alt="AlkaidLight" className="h-8" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/blog" className="transition-colors hover:text-gray-600 dark:hover:text-gray-300">
              Blog
            </Link>
            <Link href="/about" className="transition-colors hover:text-gray-600 dark:hover:text-gray-300">
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Search />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
