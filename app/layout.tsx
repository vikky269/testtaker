import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuizProvider } from "./context/QuizContext";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smartmathz Test Taker",
  description: "Level up your preparedness by taking our practice tests",
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
        <Navbar />
        <QuizProvider>
          <main className="">
             <Toaster position="top-right" reverseOrder={false} />
            {children}
          </main>
        </QuizProvider>
      
      </body>
    </html>
  );
}
