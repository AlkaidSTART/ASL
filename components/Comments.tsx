'use client';

import Giscus from '@giscus/react';
import { useEffect, useState } from 'react';

export default function Comments() {
  // 评论功能暂时封存
  return null;

  return (
    <div className="mt-12">
      {/* 液态玻璃风格的评论区域标题 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          评论讨论
        </h3>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>
      </div>
      
      {/* 液态玻璃风格的评论容器 */}
      <div className="ios-26-liquid-glass-comments group relative rounded-xl border border-white/20 dark:border-slate-700/20 p-6 transition-all duration-300 hover:border-white/30 dark:hover:border-slate-600/30 overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 backdrop-blur-sm dark:from-slate-800/30 dark:via-slate-800/20 dark:to-slate-800/10"></div>
        
        {/* 边框光效 */}
        <div className="absolute inset-0 -z-10 rounded-xl border border-white/40 dark:border-white/20 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        {/* 阴影效果 */}
        <div className="absolute inset-0 -z-10 rounded-xl shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 group-hover:shadow-xl transition-shadow duration-300"></div>
        
        {/* 光泽效果 */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <Giscus
          repo="AlkaidSTART/ASL"
          repoId="R_kgDOQZ_uUA"
          category="comments"
          categoryId="DIC_kwDOQZ_uUM4C4cLn"
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
          strict="0"
        />
      </div>
    </div>
  );
}