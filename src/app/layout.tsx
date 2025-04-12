import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";

 

export const metadata: Metadata = {
  title: "Memory card",
  description: "Memory card",
  icons: {
    icon: "/logo2.png", //   logo2.png nằm trong thư mục public
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
      <Header />
      {children}
    </body>
  </html>
  );
}
