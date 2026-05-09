import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import ServiceWorkerRegistrar from "@/components/layout/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "Daily — 캘린더 & 일기",
  description: "날짜 중심으로 일정 · 할일 · 일기가 하나로 통합된 앱",
  manifest: "/manifest.json",
  keywords: ["캘린더", "일기", "할일", "일정관리", "다이어리"],
  icons: {
    icon: [
      { url: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
      { url: '/api/icon?size=512', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Daily",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1814" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>{children}</Providers>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
