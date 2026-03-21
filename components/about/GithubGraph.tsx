"use client";

import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { personalInfo } from "@/lib/about-data";

export function GithubGraph() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 确保水合完成后再渲染，避免主题切换闪烁
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // 极简冷淡风 (高对比度深幽灰阶，提升辨识度)
  const explicitTheme = {
    light: [
      '#ebedf0', // 0 提交：标准浅底色，不突兀
      '#9ca3af', // 少量提交：具有一定辨识度的灰
      '#6b7280', // 正常提交：中等深灰
      '#4b5563', // 大量提交：深灰
      '#111827', // 满载提交：近乎纯黑，极端反差
    ],
    dark: [
      '#161b22', // 0 提交：暗夜底色
      '#4b5563', // 少量提交：深灰
      '#6b7280', // 正常提交：中等灰
      '#9ca3af', // 大量提交：亮灰
      '#f3f4f6', // 满载提交：近乎纯白，极为耀眼
    ],
  };

  if (!mounted) return <div className="h-[150px] w-full animate-pulse rounded-md bg-gray-200/50 dark:bg-gray-800/50"></div>;

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2 flex justify-center text-sm">
      <GitHubCalendar 
        username={personalInfo.githubUsername} 
        colorScheme={isDark ? "dark" : "light"}
        theme={explicitTheme}
      />
    </div>
  );
}