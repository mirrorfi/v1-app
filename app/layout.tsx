import type { Metadata } from "next";
import "./globals.css";
// import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppWalletProvider } from "@/components/providers/AppWalletProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Navbar } from "@/components/Navbar";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next"

const satoshi = localFont({
  src: "../public/fonts/Satoshi-Bold.otf",
  variable: "--font-satoshi",
  style: "bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MirrorFi - Copy Yield Farming on Solana",
  description:
    "Share/Mirror the best Yield Strategies across multiple protocols",
};

const univaNova = localFont({
  src: "../public/fonts/UnivaNova-Regular.otf",
  variable: "--font-univa",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <AppWalletProvider>
          <body
            className={`min-h-screen antialiased ${satoshi.variable} ${univaNova.variable}`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange={false}
            >
              <NotificationProvider>
                <TooltipProvider>
                  {children}
                  <Analytics />
                  {/* <Toaster richColors /> */}
                </TooltipProvider>
              </NotificationProvider>
            </ThemeProvider>
          </body>
      </AppWalletProvider>
    </html>
  );
}