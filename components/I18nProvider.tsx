'use client';

import { useEffect } from 'react';
import { useI18nStore } from '@/stores/i18nStore';

export function I18nProvider() {
  const { language } = useI18nStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  return null;
}