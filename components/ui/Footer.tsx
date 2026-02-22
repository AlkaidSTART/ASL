export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-center dark:border-gray-800 dark:bg-black">
      <div className="container mx-auto px-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} AlkaidLight. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
