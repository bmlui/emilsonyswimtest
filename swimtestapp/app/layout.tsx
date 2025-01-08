import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swim Test — Emilson Y",
  description: "Swim test logger app for South Shore YMCA Emilson Branch in Hanover, MA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="relative">
        
          {children}
        </div>
        <footer className="text-center text-gray-500 mb-5 ml-5 mr-5">
        A Culture of Safety. A Commitment to Care. A Standard of Excellence.<br/>
          Data is synced with the Google Sheet on the supervisor account.<br/>
          For support, please email <a href="mailto:contact@brandonlui.com" className="text-blue-500 underline">contact@brandonlui.com</a> or call <a href="tel:+18024172584" className="text-blue-500 underline ">+1 (802) 417-BLUI</a> (1-802-417-2584).
        </footer>
        <div className="min-h-screen"></div>
      </body>
    </html>
  );
}
