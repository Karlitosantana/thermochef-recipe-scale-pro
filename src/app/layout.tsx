import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { I18nProvider } from '@/components/providers/i18n-provider';
import ErrorBoundary from '@/components/error-boundary';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThermoChef - Convert Any Recipe for Your Thermomix",
  description: "Convert recipes from any website into perfect Thermomix instructions. Compatible with TM5, TM6, and TM7 devices. Get meal planning, shopping lists, and more.",
  keywords: "thermomix, recipe converter, TM5, TM6, TM7, cooking, recipes, meal planning, thermochef",
  authors: [{ name: "ThermoChef Team" }],
  creator: "ThermoChef",
  publisher: "ThermoChef",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://thermochef.com'),
  openGraph: {
    title: "ThermoChef - Convert Any Recipe for Your Thermomix",
    description: "Convert recipes from any website into perfect Thermomix instructions. Compatible with TM5, TM6, and TM7 devices.",
    url: "/",
    siteName: "ThermoChef",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ThermoChef - Recipe Conversion for Thermomix",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThermoChef - Convert Any Recipe for Your Thermomix",
    description: "Convert recipes from any website into perfect Thermomix instructions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body
          className="font-sans antialiased"
        >
          <ErrorBoundary>
            <I18nProvider>
              {children}
            </I18nProvider>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
