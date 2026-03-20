"use client";

import { GitHubCalendar } from "react-github-calendar";
import { personalInfo } from "@/lib/about-data";

export function GithubGraph() {
  const explicitTheme = {
    light: ['#f0f0f0', '#c4edde', '#7ac7c4', '#f73859', '#384259'],
    dark: ['#383838', '#4D455D', '#7DB9B6', '#F5E9CF', '#E96479'],
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2 flex justify-center text-sm">
      <GitHubCalendar 
        username={personalInfo.githubUsername} 
        colorScheme="light"
        theme={explicitTheme}
      />
    </div>
  );
}