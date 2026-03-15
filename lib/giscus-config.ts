// Giscus 配置测试工具
// 用于验证 GitHub Discussions 和 Giscus 设置

export const giscusConfig = {
  // 基础配置
  repo: "AlkaidSTART/ASL",
  repoId: "R_kgDOQZ_uUA",
  
  // 映射方式
  mapping: "pathname",
  
  // 其他设置
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN",
  loading: "lazy"
};

// 验证检查清单
export const giscusChecklist = [
  {
    id: 1,
    title: "仓库公开性检查",
    description: "确保 AlkaidSTART/ASL 是公开仓库",
    check: () => {
      // 可以通过访问 https://github.com/AlkaidSTART/ASL 验证
      return "请手动验证：仓库是否为公开？";
    }
  },
  {
    id: 2,
    title: "Discussions 功能启用",
    description: "在仓库设置中启用 Discussions",
    check: () => {
      return "请检查：Settings → General → Features → Discussions ✓";
    }
  },
  {
    id: 3,
    title: "Giscus App 安装",
    description: "安装 Giscus GitHub App",
    check: () => {
      return "请访问：https://github.com/apps/giscus 并安装到您的仓库";
    }
  },
  {
    id: 4,
    title: "分类配置（可选）",
    description: "创建或检查 Discussion 分类",
    check: () => {
      return "可选：在 Discussions 中创建 General 分类";
    }
  }
];

// 错误排查指南
export const giscusTroubleshooting = {
  "Unable to create discussion": [
    "Giscus App 未正确安装",
    "仓库不是公开的",
    "Discussions 功能未启用",
    "GitHub API 限制或权限问题"
  ],
  "giscus is not installed": [
    "需要安装 Giscus GitHub App",
    "检查仓库访问权限"
  ],
  "Repository not found": [
    "检查仓库名称拼写",
    "验证仓库是否公开"
  ]
};

// 推荐的配置步骤
export const setupSteps = [
  "1. 确保仓库是公开的",
  "2. 在仓库设置中启用 Discussions",
  "3. 访问 https://github.com/apps/giscus 安装 App",
  "4. 选择您的仓库并授权",
  "5. 等待几分钟让权限生效",
  "6. 测试评论功能"
];