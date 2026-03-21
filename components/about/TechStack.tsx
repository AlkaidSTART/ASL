"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Wrench, Rocket, Smartphone } from "lucide-react";

const skillCategories = [
  {
    title: { en: "Frontend Core", zh: "前端核心界" },
    icon: <Monitor className="w-4 h-4 text-blue-500" />,
    skills: [
      { name: "Vue", bg: "bg-emerald-50 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400" },
      { name: "React", bg: "bg-blue-50 dark:bg-blue-900/30", color: "text-blue-600 dark:text-blue-400" },
      { name: "HTML / CSS", bg: "bg-orange-50 dark:bg-orange-900/30", color: "text-orange-600 dark:text-orange-400" },
      { name: "JS / TS", bg: "bg-yellow-50 dark:bg-yellow-900/30", color: "text-yellow-700 dark:text-yellow-500" },
      { name: "SCSS / Less", bg: "bg-pink-50 dark:bg-pink-900/30", color: "text-pink-600 dark:text-pink-400" },
      { name: "Zustand", bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-700 dark:text-slate-300" },
      { name: "Pinia", bg: "bg-yellow-100 dark:bg-yellow-900/30", color: "text-yellow-600 dark:text-yellow-400" },
    ]
  },
  {
    title: { en: "Backend & DB", zh: "后端与数据库" },
    icon: <Server className="w-4 h-4 text-green-500" />,
    skills: [
      { name: "NestJS", bg: "bg-red-50 dark:bg-red-900/30", color: "text-red-600 dark:text-red-400" },
      { name: "Express", bg: "bg-gray-100 dark:bg-gray-800", color: "text-gray-600 dark:text-gray-400" },
      { name: "Prisma", bg: "bg-indigo-50 dark:bg-indigo-900/30", color: "text-indigo-600 dark:text-indigo-400" },
      { name: "TypeORM", bg: "bg-red-50 dark:bg-red-900/30", color: "text-red-700 dark:text-red-500" },
    ]
  },
  {
    title: { en: "Cross-Platform", zh: "跨平台与移动端" },
    icon: <Smartphone className="w-4 h-4 text-purple-500" />,
    skills: [
      { name: "Flutter", bg: "bg-sky-50 dark:bg-sky-900/30", color: "text-sky-600 dark:text-sky-400" },
      { name: "UniApp", bg: "bg-green-50 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" },
    ]
  },
  {
    title: { en: "Engineering & Tooling", zh: "前端工程化" },
    icon: <Wrench className="w-4 h-4 text-amber-500" />,
    skills: [
      { name: "Vite", bg: "bg-purple-50 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
      { name: "ESLint", bg: "bg-indigo-50 dark:bg-indigo-900/30", color: "text-indigo-600 dark:text-indigo-400" },
      { name: "Prettier", bg: "bg-teal-50 dark:bg-teal-900/30", color: "text-teal-600 dark:text-teal-400" },
    ]
  },
  {
    title: { en: "DevOps", zh: "DevOps & 自动化" },
    icon: <Rocket className="w-4 h-4 text-red-500" />,
    skills: [
      { name: "GitHub Actions", bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-800 dark:text-slate-200" },
    ]
  }
];

export function TechStack() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {skillCategories.map((category, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          {/* 分类标题 */}
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-black/5 dark:border-white/5 pb-1">
            {category.icon}
            <span className="lang-en">{category.title.en}</span>
            <span className="lang-zh">{category.title.zh}</span>
          </div>
          {/* 技能标签 */}
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 + idx * 0.1 }}
                whileHover={{ y: -2, scale: 1.05 }}
                className={`flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-shadow hover:shadow-md cursor-default ${skill.bg} ${skill.color}`}
              >
                {skill.name}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
