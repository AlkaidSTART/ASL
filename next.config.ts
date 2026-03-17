import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  // 性能优化配置
  experimental: {
    // 优化包体积
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
    ],
  },
  // 压缩配置
  compress: true,
  // 生成Etags用于缓存
  generateEtags: true,
  //  poweredByHeader: false,
  // 静态页面优化
  distDir: "dist",
};

export default nextConfig;
