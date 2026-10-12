import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "MAABAR | معبر — حياة أسهل، مستقبل أذكى",
  description:
    "منصة سعودية تجريبية موحدة للخدمات الحكومية، مدعومة بالذكاء الاصطناعي. A smarter way to navigate government services.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preload" href="/saudi-hero.webp" as="image" />
        <link
          rel="preload"
          href="/fonts/alexandria-arabic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
