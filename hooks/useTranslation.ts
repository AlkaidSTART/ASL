import { useI18nStore } from '@/stores/i18nStore';

export const translations = {
  hero: {
    greeting: {
      zh: "Hi，我是",
      en: "Hello, I'm"
    },
    role: {
      zh: "独立开发者 / 设计师",
      en: "Indie Hacker / Designer"
    },
    description1: {
      zh: "在这里记录我的技术探索与生活灵感。",
      en: "Documenting my tech explorations and life inspirations here."
    },
    description2: {
      zh: "追求极简，热爱开源。相信写代码也是一种艺术。",
      en: "Minimalism advocate. Open-source enthusiast. Code is an art."
    },
    explore: {
      zh: "探索文章",
      en: "Explore Blog"
    },
    about: {
      zh: "关于我",
      en: "About Me"
    }
  },
  search: {
    placeholder: {
      zh: "搜索...",
      en: "Search..."
    },
    shortcut: {
      zh: "探索",
      en: "Explore"
    },
    noResults: {
      zh: "未找到相关内容于 \"{{query}}\"",
      en: "No results found for \"{{query}}\""
    }
  },
  post: {
    readMore: {
      zh: "阅读全文",
      en: "Read More"
    },
    readingTime: {
      zh: "{{time}} 分钟阅读",
      en: "{{time}} min read"
    },
    noDate: {
      zh: "不详",
      en: "No date"
    },
    back: {
      zh: "返回",
      en: "Back"
    }
  },
  footer: {
    builtWith: {
      zh: "基于 Next.js 与 GSAP 构建",
      en: "Built with Next.js & GSAP"
    },
    rights: {
      zh: "保留所有权利。",
      en: "All rights reserved."
    },
    inspiredBy: {
      zh: "由极致热爱驱动。",
      en: "Driven by passion."
    },
    copyright: {
      zh: "AlkaidLight",
      en: "AlkaidLight"
    },
    hostedOn: {
      zh: "托管于 GitHub Pages",
      en: "Hosted on GitHub Pages"
    }
  },
  about: {
    pageTitle: {
      zh: "关于作者",
      en: "About Author"
    },
    projects: {
      zh: "开源项目",
      en: "Projects"
    },
    techStack: {
      zh: "技术栈",
      en: "Tech Stack"
    },
    timeline: {
      zh: "历程",
      en: "Timeline"
    }
  },
  contact: {
    pageTitle: {
      zh: "联系我",
      en: "Contact Me"
    },
    email: {
      zh: "通过邮件",
      en: "Email"
    },
    social: {
      zh: "社交媒体",
      en: "Social"
    }
  },
  theme: {
    toggle: {
      zh: "切换主题",
      en: "Toggle Theme"
    }
  }
};

type Section = keyof typeof translations;
type Key<T extends Section> = keyof typeof translations[T];

export function useTranslation() {
  const { language } = useI18nStore();

  const t = <S extends Section>(section: S, key: Key<S>, params?: Record<string, string | number>): string => {
    let text = translations[section]?.[key]?.[language] || translations[section]?.[key]?.['en'] || key as string;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  };

  return { t, language };
}
