import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// PWA ve İkon Ayarları Buradan Yapılır
export const metadata: Metadata = {
  title: "Pera Balon",
  description: "Stok ve Sipariş Takip Sistemi",
  manifest: "/manifest.json", // PWA ayar dosyası
  icons: {
    icon: "/icon.png",        // Tarayıcı sekmesi ikonu
    shortcut: "/icon.png",
    apple: "/apple-icon.png", // iPhone ana ekran ikonu
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pera Balon",
  },
};

export const viewport: Viewport = {
  themeColor: "#BE6A6C", // Telefonun üst çubuk rengi (Gül Kurusu)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Uygulama hissi için zoom'u kapatır
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}