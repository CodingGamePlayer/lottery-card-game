import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "로또 카드 게임",
  description: "행운의 카드를 선택하여 당첨 기회를 잡으세요!",
  keywords: "로또, 카드 게임, 운, 당첨, 온라인 게임, 개인 프로젝트",
  openGraph: {
    title: "로또 카드 게임",
    description: "행운의 카드를 선택하여 당첨 기회를 잡으세요!",
    type: "website",
    url: "https://lottery-card-game.vercel.app",
    images: [
      {
        url: "https://lottery-card-game.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "로또 카드 게임 미리보기",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
