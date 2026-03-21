"use client";

import { Github, Twitter, Youtube, MessageCircle } from "lucide-react";

import { personalInfo } from "@/lib/about-data";

// 自定义 SVG 图标（针对没有收录在 Lucide 的国内平台）
const XiaohongshuIcon = ({ className }: { className?: string }) => (
  // 省略SVG代码，保持不变...
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.176 17.59c-.482.096-1.07.135-1.748.135-1.57 0-2.47-.367-3.08-1.05-.623-.695-.783-1.68-.783-2.616v-3.79c0-.493-.01-.986-.01-1.478 0-.464-.32-.82-.773-.82a.763.763 0 0 0-.783.753v5.43c0 1.256.368 2.376 1.15 3.207.82.87 2.067 1.343 3.845 1.343.832 0 1.56-.058 2.164-.174.454-.087.696-.54.696-1.004V5.702c0-.484-.33-.84-.793-.84a.8.8 0 0 0-.802.773v11.954z"/>
  </svg>
);

const JuejinIcon = ({ className }: { className?: string }) => (
  // 省略SVG代码，保持不变...
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.984 0L1.758 7.377l2.25 1.765 7.976-5.748 7.973 5.753 2.25-1.765L11.984 0zm0 4.962L5.802 9.426l2.25 1.765 3.932-2.836 3.932 2.835 2.25-1.764-6.182-4.464zm0 4.96L8.442 12.44l2.25 1.764 1.292-.93 1.293.93 2.25-1.765-3.543-2.517zM2.87 14.88l9.114 6.567 9.113-6.568-2.25-1.765-6.863 4.947-6.863-4.947-2.25 1.765z"/>
  </svg>
);

const socials = [
  { name: "GitHub", icon: Github, link: personalInfo.socials.github, color: "hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-black" },
  { name: "X (Twitter)", icon: Twitter, link: personalInfo.socials.twitter, color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" },
  { name: "Bilibili", icon: Youtube, link: personalInfo.socials.bilibili, color: "hover:bg-[#fb7299] hover:text-white" },
  { name: "小红书", icon: XiaohongshuIcon, link: personalInfo.socials.xiaohongshu, color: "hover:bg-[#ff2442] hover:text-white" },
  { name: "掘金", icon: JuejinIcon, link: personalInfo.socials.juejin, color: "hover:bg-[#1e80ff] hover:text-white" },
  { name: "知乎", icon: MessageCircle, link: personalInfo.socials.zhihu, color: "hover:bg-[#0066ff] hover:text-white" },
];

export function SocialLinks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {socials.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-white/40 px-4 py-3 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all duration-300 dark:border-white/5 dark:bg-black/20 dark:text-gray-300 ${social.color}`}
          >
            <Icon className="h-4 w-4" />
            <span>{social.name}</span>
          </a>
        );
      })}
    </div>
  );
}
