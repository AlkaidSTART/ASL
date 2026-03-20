"use client";

import { motion } from "framer-motion";

const skills = [
  // Frontend
  { name: "React", bg: "bg-blue-50 dark:bg-blue-900/30", color: "text-blue-600 dark:text-blue-400" },
  { name: "Vue3", bg: "bg-emerald-50 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400" },
  { name: "Next.js", bg: "bg-gray-100 dark:bg-gray-800", color: "text-gray-900 dark:text-gray-100" },
  { name: "Vite", bg: "bg-purple-50 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
  { name: "TypeScript", bg: "bg-blue-50 dark:bg-blue-900/30", color: "text-blue-700 dark:text-blue-500" },
  { name: "Tailwind", bg: "bg-cyan-50 dark:bg-cyan-900/30", color: "text-cyan-600 dark:text-cyan-400" },
  // Cross & Mobile
  { name: "Flutter", bg: "bg-sky-50 dark:bg-sky-900/30", color: "text-sky-600 dark:text-sky-400" },
  { name: "UniApp", bg: "bg-green-50 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" },
  // Backend & DB
  { name: "Node.js", bg: "bg-green-50 dark:bg-green-900/30", color: "text-green-700 dark:text-green-500" },
  { name: "NestJS", bg: "bg-red-50 dark:bg-red-900/30", color: "text-red-600 dark:text-red-400" },
  { name: "Express", bg: "bg-gray-100 dark:bg-gray-800", color: "text-gray-600 dark:text-gray-400" },
  { name: "Prisma", bg: "bg-indigo-50 dark:bg-indigo-900/30", color: "text-indigo-600 dark:text-indigo-400" },
  // DevOps & Tools
  { name: "CI/CD", bg: "bg-orange-50 dark:bg-orange-900/30", color: "text-orange-600 dark:text-orange-400" },
  { name: "Git", bg: "bg-orange-50 dark:bg-orange-900/30", color: "text-orange-700 dark:text-orange-500" },
  { name: "Shadcn", bg: "bg-gray-200 dark:bg-gray-700", color: "text-gray-900 dark:text-gray-100" },
];

export function TechStack() {
  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.03 }}
          whileHover={{ y: -3, scale: 1.05 }}
          className={`flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-shadow hover:shadow-md cursor-default ${skill.bg} ${skill.color}`}
        >
          {skill.name}
        </motion.div>
      ))}
    </div>
  );
}
