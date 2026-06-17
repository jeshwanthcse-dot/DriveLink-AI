import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DriveLink AI — Smart Driver Matching. Intelligent Deliveries.",
  description:
    "AI-powered driver exchange and logistics marketplace. Connect organizations with professional drivers through intelligent matching and real-time tracking.",
  keywords: [
    "logistics",
    "driver matching",
    "delivery tracking",
    "AI logistics",
    "freight",
  ],
  openGraph: {
    title: "DriveLink AI",
    description: "Smart Driver Matching. Intelligent Deliveries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans bg-background text-foreground antialiased transition-colors duration-200">
        <ThemeProvider defaultTheme="light" storageKey="drivelink-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
