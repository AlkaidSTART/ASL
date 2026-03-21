"use client";

import { Terminal, BrainCircuit } from "lucide-react";

export function AITools() {
  const aiIDEs = [
    { name: "Cursor" },
    { name: "Windsurf" },
    { name: "Trae" },
    { name: "Trae-cn" },
    { name: "GitHub Copilot" },
    { name: "Claude Code" },
    { name: "Codex" },
    { name: "Xcode" },
    { name: "Qorder" }
  ];

  const aiLLMs = [
    { name: "Claude Code", active: true },
    { name: "ChatGPT" },
    { name: "Kimi" },
    { name: "DeepSeek", active: true },
    { name: "Gemini" },
    { name: "GLM" },
    { name: "MiniMax" }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 lg:gap-12 mt-2">
      {/* 模块 1: AI IDEs */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
          <Terminal className="w-4 h-4 text-zinc-500" />
          <span className="lang-en">AI IDE & Workflows</span>
          <span className="lang-zh">AI 辅助环境</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {aiIDEs.map((tool) => (
            <div
              key={tool.name}
              className="flex items-center rounded-xl border border-zinc-200/50 bg-white/40 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-sm dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:bg-zinc-700/80 cursor-default"
            >
              {tool.name}
            </div>
          ))}
        </div>
      </div>

      {/* 模块 2: AI LLMs & Models */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
          <BrainCircuit className="w-4 h-4 text-zinc-500" />
          <span className="lang-en">Daily Commute LLMs</span>
          <span className="lang-zh">高频主力模型</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {aiLLMs.map((model) => (
            <div
              key={model.name}
              className={`flex items-center rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm cursor-default ${
                model.active
                  ? "border-amber-200/50 bg-amber-50/50 text-amber-800 hover:bg-amber-100/60 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300 flex gap-1.5 items-center"
                  : "border-zinc-200/50 bg-white/40 text-zinc-700 hover:bg-white/80 dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:text-zinc-300 dark:hover:bg-zinc-700/80"
              }`}
            >
              {model.active && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>}
              {model.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}