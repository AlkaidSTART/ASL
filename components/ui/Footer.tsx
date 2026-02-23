export function Footer() {
  return (
    <footer className="border-t border-gray-200/50 bg-[rgb(240,232,216)] py-8 text-center backdrop-blur-sm dark:border-gray-800/50 dark:bg-[rgb(248,240,224)]">
      <div className="container mx-auto px-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
          &copy; {new Date().getFullYear()} AlkaidLight 
          <span className="mx-2">·</span> 
           Hosted on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
