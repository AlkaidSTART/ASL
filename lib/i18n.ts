'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源
const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        blog: 'Blog',
        about: 'About',
        contact: 'Contact',
      },
      location: {
        locating: 'LOCATING...',
        sameCity: 'SAME CITY',
        away: '{{distance}} KM AWAY',
        hidden: 'HIDDEN',
        basedIn: 'BASED IN {{city}}',
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        blog: '博客',
        about: '关于',
        contact: '联系',
      },
      location: {
        locating: '计算中...',
        sameCity: '我们在同一座城市！',
        away: '距我的设备 {{distance}} KM',
        hidden: '位置未知',
        basedIn: '以 {{city}} 为中心',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh', // 默认中文
    interpolation: {
      escapeValue: false // React 已经自带防 XSS
    }
  });

export default i18n;