"use client";

import { Briefcase, GraduationCap, Rocket } from "lucide-react";

const events = [
  {
    icon: Rocket,
    year: "2024 - Present",
    title: "AI & Full Stack Exploration",
    description: "Deep dive into Next.js, AI IDEs, and modern full-stack architectures. Building projects with Vibe Coding setups.",
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30"
  },
  {
    icon: Briefcase,
    year: "202x - 2024",
    title: "Frontend & Cross-Platform Developer",
    description: "Developing responsive web applications and cross-platform mobile apps using React, Vue3, and Flutter/UniApp.",
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30"
  },
  {
    icon: GraduationCap,
    year: "202x",
    title: "The Journey Begins",
    description: "Started the journey of coding, learning HTML/CSS, JS, and establishing forming the base of engineering logic.",
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30"
  }
];

export function Timeline() {
  return (
    <div className="relative border-l border-gray-200 dark:border-gray-700/50 mt-4 ml-3 p-4">
      {events.map((event, index) => {
        const Icon = event.icon;
        return (
          <div 
            key={index}
            className="mb-8 ml-6 last:mb-0"
          >
            <span className={`absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white dark:ring-black/50 ${event.bg}`}>
              <Icon className={`h-4 w-4 ${event.color}`} />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400">{event.year}</span>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">{event.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}