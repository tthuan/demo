import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ビューティーサロン HANA | ご予約",
  description:
    "ビューティーサロン HANAのオンライン予約ページです。カット、カラー、パーマなど各種メニューのご予約を承っております。",
  keywords: "美容室, サロン, 予約, カット, カラー, パーマ, 渋谷",
  robots: "index, follow",
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
