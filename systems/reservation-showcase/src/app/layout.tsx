import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "予約システム デモ | 業種別ショーケース",
  description:
    "美容サロン・クリニック・レストラン向け予約システムのデモ。Next.js + Tailwind CSS + Supabaseで構築。",
  keywords: "予約システム, サロン, クリニック, レストラン, デモ, Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
