import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Preloader } from "@/components/Preloader";
import Search from "@/components/Search";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "AlkaidLight Blog",
  description: "A Vibe Coding Blog",
  icons: {
    icon: `${basePath}/avatorone.jpg`,
  },
  // 预连接到关键域名
  other: {
    "preconnect": "https://fonts.googleapis.com",
    "preconnect-dns": "https://fonts.gstatic.com",
  },
};

// 视口配置单独导出
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS预解析 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Preloader />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Search />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
