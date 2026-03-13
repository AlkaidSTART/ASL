const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 sm:text-7xl">
        <img src={`${basePath}/avatorone.jpg`} alt="AlkaidLight" className="h-16" />
      </h1>
      <p className="mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
        <span className="lang-en">A personal blog built with Next.js, Vibe Coding, and AI.</span>
        <span className="lang-zh">一个使用 Next.js、Vibe Coding 与 AI 构建的个人博客。</span>
      </p>
    </div>
  );
}
