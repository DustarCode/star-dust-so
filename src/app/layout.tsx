import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "星尘网盘搜索 - 网盘资源聚合搜索平台",
    template: "%s - 星尘网盘搜索"
  },
  description: "星尘网盘搜索是一个专业的网盘资源聚合搜索平台，支持百度网盘、阿里云盘、夸克网盘、迅雷云盘等12种主流网盘资源搜索，提供精准的资源筛选和排序功能，帮助用户快速找到所需资源。",
  keywords: ["网盘搜索", "百度网盘", "阿里云盘", "夸克网盘", "资源搜索", "网盘资源", "磁力链接", "电驴链接"],
  authors: [{ name: "星尘网盘搜索" }],
  creator: "星尘网盘搜索",
  publisher: "星尘网盘搜索",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://so.dustpix.com",
  },
  openGraph: {
    title: "星尘网盘搜索 - 网盘资源聚合搜索平台",
    description: "支持12种主流网盘资源搜索，快速找到您需要的资源",
    url: "https://so.dustpix.com",
    siteName: "星尘网盘搜索",
    images: [
      {
        url: "https://so.dustpix.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "星尘网盘搜索",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "星尘网盘搜索 - 网盘资源聚合搜索平台",
    description: "支持12种主流网盘资源搜索，快速找到您需要的资源",
    images: ["https://so.dustpix.com/twitter-image.png"],
    creator: "@dustpix",
  },
  metadataBase: new URL('https://so.dustpix.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-background to-secondary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen backdrop-blur-sm">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster />
          </div>
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
