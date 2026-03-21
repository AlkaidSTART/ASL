"use client";

import { FolderGit2, ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "AlkaidLight Blog",
    description: "A modern, AI-powered personal blog built with Next.js 14, Tailwind CSS, and Framer Motion.",
    tags: ["Next.js", "Tailwind", "MDX"],
    link: "#",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    name: "Cross-Platform Dashboard",
    description: "An enterprise-level dashboard interface supporting both web and mobile experiences seamlessly.",
    tags: ["Vue3", "TypeScript", "Element Plus"],
    link: "#",
    color: "from-emerald-500/20 to-teal-500/20"
  }
];

export function Projects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {projects.map((project, index) => (
        <a
          href={project.link}
          key={project.name}
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/5 bg-white/50 p-6 transition-all hover:shadow-lg dark:border-white/5 dark:bg-black/40 hover:-translate-y-1"
        >
          {/* 背景渐变点缀 */}
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl transition-opacity group-hover:opacity-70 opacity-30 ${project.color}`} />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-black/5 dark:bg-white/10 p-2">
                <FolderGit2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gray-800 dark:group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map(tag => (
              <span key={tag} className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  );
}