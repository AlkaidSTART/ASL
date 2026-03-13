'use client';

import Giscus from '@giscus/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Comments() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setMounted(true);
    
    // Initial language sync
    const currentLang = document.documentElement.dataset.lang || 'en';
    setLang(currentLang);

    // Observe language changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-lang') {
          const newLang = document.documentElement.dataset.lang || 'en';
          setLang(newLang);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-lang'],
    });

    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-16 w-full">
      {/* 
        TODO: Replace the following props with your own repository information.
        You can get these values by enabling Giscus on your repo: https://giscus.app
      */}
      <Giscus
        key={pathname} // Force re-render on route change
        id="comments"
        repo="AlkaidSTART/ASL" 
        repoId="R_kgDON1sW4A" // PLACEHOLDER: Replace with your actual repoId
        category="Announcements"
        categoryId="DIC_kwDON1sW4M4Cm0_V" // PLACEHOLDER: Replace with your actual categoryId
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light" // Matches the global beige theme
        lang={lang}
        loading="lazy"
      />
    </div>
  );
}
