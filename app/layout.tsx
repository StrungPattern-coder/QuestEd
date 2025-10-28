import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import Footer from "@/components/Footer";

const audiowide = Audiowide({ 
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PICT German Test Platform",
  description: "Interactive German language testing platform for PICT students and teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${audiowide.className} flex flex-col min-h-screen`}>
        <LanguageProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
