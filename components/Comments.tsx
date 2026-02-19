'use client';

import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <div className="mt-16">
      <Giscus
        id="comments"
        repo="owner/repo"
        repoId="R_kgDOG_abc"
        category="Announcements"
        categoryId="DIC_kwDOG_abc"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
