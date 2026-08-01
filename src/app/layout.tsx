import type { Metadata } from "next";
import { Nunito, Dancing_Script } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Do You Love Me? ❤️ | Special Interactive Gift",
  description: "An interactive proposal and romantic gift hub created with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${dancingScript.variable}`}>
      <body className="font-ui bg-[#FFF5F7] text-[#4A3E4E] antialiased min-h-screen selection:bg-[#FF4D6D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
