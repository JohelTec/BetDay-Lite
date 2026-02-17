import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BetDay Lite - Plataforma de Apuestas Deportivas",
  description: "Realiza apuestas en eventos deportivos del día con BetDay Lite",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <SessionProvider session={session}>
          <Toaster 
            position="top-center" 
            richColors 
            expand={true}
            closeButton={true}
            toastOptions={{
              style: {
                fontSize: '14px',
              },
            }}
          />
          <Navbar 
            isAuthenticated={!!session} 
            userName={session?.user?.name || null}
          />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
