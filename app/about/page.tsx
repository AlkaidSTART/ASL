'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePageStore } from '@/stores/pageStore';
import { TechStack } from '@/components/about/TechStack';
import { SocialLinks } from '@/components/about/SocialLinks';
import { Timeline } from '@/components/about/Timeline';
import { GithubGraph } from '@/components/about/GithubGraph';
import { Projects } from '@/components/about/Projects';
import { AITools } from '@/components/about/AITools';
import { ArrowLeft, Sparkles, Code2, Gamepad2, Compass, Link as LinkIcon, Milestone, Github, Briefcase, Cpu } from 'lucide-react';
import { personalInfo } from '@/lib/about-data';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

// 统一的毛玻璃卡片组件 (Bento Box)
const BentoCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <div
      className={`bento-card rounded-[24px] border border-zinc-200/50 bg-white/40 p-8 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/40 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-500 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] w-full ${className}`}
    >
      {children}
    </div>
  );
};

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setIsAboutPage } = usePageStore();

  useEffect(() => {
    setIsAboutPage(true);
    return () => {
      setIsAboutPage(false);
    };
  }, [setIsAboutPage]);

  useGSAP(() => {
    gsap.fromTo(
      '.bento-card',
      { y: 50, opacity: 0, scale: 0.98 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8, 
        stagger: 0.1, 
        ease: 'power3.out',
        clearProps: 'all' // prevents hover transform collisions
      }
    );
  }, { scope: containerRef });

  return (
    <div className="min-h-screen" ref={containerRef}>
      {/* 液态玻璃风格的返回主页按钮 */}
      <div 
        className="fixed left-4 z-50 sm:left-6 sm:top-6"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <Link 
          href="/" 
          className="flex items-center gap-2 rounded-2xl border border-zinc-200/50 bg-white/40 px-3 py-2 text-sm font-medium text-gray-700 backdrop-blur-md transition-all duration-300 hover:bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:text-gray-300 dark:hover:bg-zinc-800/80"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">
            <span className="lang-en">Back to Home</span>
            <span className="lang-zh">返回主页</span>
          </span>
        </Link>
      </div>

      <main className="mx-auto max-w-5xl px-4 pt-32 pb-24 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(0,_auto)]">

          {/* 1. 全局名片 (Hero Card) - 占据前两列 */}
          <BentoCard className="md:col-span-2 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="relative h-24 w-24 rounded-full shadow-lg ring-4 ring-white/50 dark:ring-black/50 overflow-hidden">
                <Image src={`${basePath}${personalInfo.avatarUrl}`} alt={personalInfo.name} fill className="object-cover" />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/50 px-3 py-1 text-sm dark:border-white/5 dark:bg-black/50">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">Currently Coding</span>
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {personalInfo.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                <span className="lang-en flex items-center gap-2">
                  <Compass className="h-5 w-5 text-gray-400" /> {personalInfo.bio.en}
                </span>
                <span className="lang-zh flex items-center gap-2">
                  <Compass className="h-5 w-5 text-gray-400" /> {personalInfo.bio.zh}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500/80 dark:text-gray-400/80 font-mono italic">
                {personalInfo.motto}
              </p>
            </div>
          </BentoCard>

          {/* 2. 爱好卡片：HOI4 */}
          <BentoCard className="md:col-span-1 flex flex-col justify-center items-center text-center group">
            <div className="rounded-full bg-blue-100/50 p-4 dark:bg-blue-900/20 mb-4 group-hover:scale-110 transition-transform">
              <Gamepad2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HOI4 Player</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="lang-en">Grand strategist in game.</span>
              <span className="lang-zh">《钢铁雄心4》运筹帷幄</span>
            </p>
          </BentoCard>

          {/* 3. 前沿/AI探索卡片 */}
          <BentoCard className="md:col-span-1 flex flex-col justify-center items-center text-center group">
            <div className="rounded-full bg-purple-100/50 p-4 dark:bg-purple-900/20 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI IDE</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="lang-en">Embracing newest LLMs.</span>
              <span className="lang-zh">狂热拥抱大模型与新框架</span>
            </p>
          </BentoCard>

          {/* 4. 技术栈卡片容器占据两列 */}
          <BentoCard className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-orange-100/50 p-2 dark:bg-orange-900/20">
                 <Code2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="lang-en">Weapon Arsenal</span>
                <span className="lang-zh">全栈兵器谱</span>
              </h3>
            </div>
            {/* 引入新创建的技术栈组件 */}
            <TechStack />
          </BentoCard>

          {/* 5. AI 工具与生产力流 (全新加入，独占三列宽幅展示，因为内容极其丰富) */}
          <BentoCard className="md:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-purple-100/50 p-2 dark:bg-purple-900/20">
                 <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="lang-en">AI Driven Workflow</span>
                  <span className="lang-zh">AI 驱动工作流</span>
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-1">Empowered by Multi-Agent & Copilots</p>
              </div>
            </div>
            <AITools />
          </BentoCard>

          {/* 6. 社交媒体矩阵 (占据全部三列) */}
          <BentoCard className="md:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-zinc-100/50 p-2 dark:bg-zinc-800/50">
                 <LinkIcon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="lang-en">Connect & Sync</span>
                <span className="lang-zh">社交频道与联系方式</span>
              </h3>
            </div>
            {/* 引入新创建的社交链接组件 */}
            <SocialLinks />
          </BentoCard>

          {/* 6. 成长时间线 (占用 2 列) */}
          <BentoCard className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-emerald-100/50 p-2 dark:bg-emerald-900/20">
                 <Milestone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                <span className="lang-en">Journey</span>
                <span className="lang-zh">成长与历程</span>
              </h3>
            </div>
            <Timeline />
          </BentoCard>

          {/* 7. 求职/工作状态卡片 (占用 1 列) */}
          <BentoCard className="md:col-span-1 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 animate-pulse rounded-full bg-blue-500/20 blur-xl"></div>
                <div className="relative rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 p-4 text-white shadow-xl">
                  <Briefcase className="h-10 w-10" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Open to Work
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 px-2">
                <span className="lang-en">Looking for exciting opportunities in Full-Stack & Frontend Development.</span>
                <span className="lang-zh">目前正在寻找前端/全栈开发机会，随时欢迎沟通或内推。</span>
              </p>
              <a href={`mailto:${personalInfo.email}`} className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-white dark:text-black">
                <span className="lang-en">Contact Me</span>
                <span className="lang-zh">联系我</span>
              </a>
            </div>
          </BentoCard>

          {/* 8. 个人项目展示 (占用全部 3 列) */}
          <BentoCard className="md:col-span-3">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-purple-100/50 p-2 dark:bg-purple-900/20">
                   <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="lang-en">Featured Projects</span>
                  <span className="lang-zh">精选项目</span>
                </h3>
              </div>
              <Projects />
            </div>
          </BentoCard>

          {/* 9. Github 贡献图热力图模拟 (占用全部 3 列) */}
          <BentoCard className="md:col-span-3 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gray-100/80 p-2 dark:bg-gray-800/80">
                   <Github className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    <span className="lang-en">Code Continuously</span>
                    <span className="lang-zh">代码热力</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">Real-time GitHub Contributions</p>
                </div>
              </div>
            </div>
            <GithubGraph />
          </BentoCard>

        </div>
      </main>
    </div>
  );
}