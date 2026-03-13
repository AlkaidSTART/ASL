# Markdown到MDX转换系统使用说明

## 功能概述

本项目提供了一个自动化的Markdown到MDX转换系统，允许您使用标准的Markdown格式编写文章，然后自动转换为Next.js支持的MDX格式。

## 目录结构

```
content/
├── markdown-posts/     # 存放原始Markdown文件
│   └── sample-article.md
└── posts/             # 存放转换后的MDX文件
    ├── hello-world.mdx
    └── sample-article.mdx
```

## 使用方法

### 1. 编写Markdown文章

在 `content/markdown-posts/` 文件夹中创建您的Markdown文件，使用标准的frontmatter格式：

```markdown
---
title: "文章标题"
date: "2024-03-13"
description: "文章描述"
tags: ["标签1", "标签2"]
---

# 文章标题

这里是文章内容...
```

### 2. 手动转换

运行以下命令手动转换所有Markdown文件：

```bash
pnpm convert-md
```

### 3. 自动监听（开发环境）

在开发环境中，运行以下命令监听Markdown文件变化：

```bash
pnpm watch-md
```

这将启动一个监听器，当您在 `content/markdown-posts/` 文件夹中添加或修改Markdown文件时，会自动转换到 `content/posts/` 文件夹。

### 4. 构建时自动转换

在构建项目时，转换会自动执行：

```bash
pnpm build
```

## 转换规则

1. **文件命名**: `.md` 文件转换为 `.mdx` 文件，保持相同的文件名
2. **Frontmatter**: 保留所有前端元数据（title, date, description, tags等）
3. **内容格式**: Markdown内容保持不变，支持所有标准Markdown语法
4. **自动部署**: 转换后的MDX文件会自动被Next.js识别并部署

## 注意事项

1. 确保您的Markdown文件使用正确的frontmatter格式
2. 转换过程会覆盖目标文件夹中同名的MDX文件
3. 建议在版本控制中包含原始Markdown文件和转换后的MDX文件
4. 监听器仅在开发环境中有效

## 扩展功能

您可以通过修改 `lib/convert-md-to-mdx-simple.js` 文件来添加更多转换功能，例如：

- 自定义MDX组件
- 添加语法高亮
- 图片处理
- 链接优化

## 故障排除

如果转换失败，请检查：
1. Markdown文件格式是否正确
2. frontmatter是否包含必需的字段
3. 文件权限是否正确
4. 目标文件夹是否存在