

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { AuthContextProvider } from "@/context/auth-context";
import Script from "next/script";

import { siteConfig } from "@/config/site-config";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/providers/providers";

export const maxDuration = 180;

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url ?? 'https://genai.kecyi.com'),
  title: {
    default: siteConfig.name,
    template: `${siteConfig.name} %s`,
  },
  description: siteConfig.description,


  openGraph: {
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} %s`,
    },
    images: siteConfig.images,
    // images: imageUrl,
    // description: desc,
  },
  twitter: {
    title: {
      default: siteConfig.name,
      template: `${siteConfig.name} %s`,
    },
    images: siteConfig.images,
  },

  icons: {
    icon: "/assets/favicon.ico",
    shortcut: "/assets/favicon-16x16.png",
    apple: "/assets/apple-touch-icon.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(poppins.className, '')}>
        <AuthContextProvider>
          <Providers>
            <ThemeProvider enableSystem={false} forcedTheme="light">
              {children}
            </ThemeProvider>
          </Providers>
        </AuthContextProvider>
        <TailwindIndicator />
        <Toaster richColors closeButton theme="light" />
      </body>
    </html>
  );
}
