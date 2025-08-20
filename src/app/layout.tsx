import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthInitializer } from "@/providers/auth-initializer";
import { HttpInterceptorProvider } from "@/providers/http-interceptor-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Wired People - Smart Talent Procurement",
  description: "Connect your team with a network of experts in Public Health, IT, and Cybersecurity",
  keywords: ["talent procurement", "public health", "IT", "cybersecurity", "staffing"],
  authors: [{ name: "Wired People Inc." }],
  creator: "Wired People Inc.",
  publisher: "Wired People Inc.",
  openGraph: {
    title: "Wired People - Smart Talent Procurement",
    description: "Connect your team with a network of experts in Public Health, IT, and Cybersecurity",
    url: "https://www.wiredpeopleinc.com",
    siteName: "Wired People",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wired People - Smart Talent Procurement",
    description: "Connect your team with a network of experts",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logos/wired-people-icon-teal.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/wired-people-icon-teal.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logos/wired-people-icon-teal.png",
    apple: "/logos/wired-people-icon-teal.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HttpInterceptorProvider>
            <QueryProvider>
              <AuthInitializer>
                {children}
              </AuthInitializer>
            </QueryProvider>
          </HttpInterceptorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}