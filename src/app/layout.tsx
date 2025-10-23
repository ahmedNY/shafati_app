import "@/styles/globals.css";

import { type Metadata } from "next";
import { Tajawal } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "مشروع قاسيون | رؤية جديدة للسياحة",
  description: "منصة متكاملة لإدارة وتطوير المشاريع السياحية في جبل قاسيون.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Configure the Arabic font
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" className={`${tajawal.className}`} dir="rtl">
      <body>
        <TRPCReactProvider>
          <SessionProvider>{children}</SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
