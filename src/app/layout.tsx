import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@/components/analytics/Analytics";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://vayuholidays.com"
  ),
  title: {
    default: "Vayu Holidays — Thoughtfully Planned Travel",
    template: "%s | Vayu Holidays",
  },
  description:
    "Discover thoughtfully planned holidays, unforgettable destinations and personalized travel experiences with Vayu Holidays. Bhopal's premium travel agency.",
  keywords: [
    "travel agency",
    "holiday packages",
    "tour operator",
    "Bhopal",
    "Madhya Pradesh",
    "domestic tours",
    "international tours",
    "honeymoon packages",
    "Kashmir tour",
    "Goa packages",
    "Vayu Holidays",
  ],
  authors: [{ name: "Vayu Holidays" }],
  creator: "Vayu Holidays",
  publisher: "Vayu Holidays",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Vayu Holidays",
    title: "Vayu Holidays — Thoughtfully Planned Travel",
    description:
      "Discover thoughtfully planned holidays, unforgettable destinations and personalized travel experiences with Vayu Holidays.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vayu Holidays — Thoughtfully Planned Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vayu Holidays — Thoughtfully Planned Travel",
    description:
      "Premium travel experiences, holiday packages and personalized tours from Vayu Holidays, Bhopal.",
    images: ["/og-image.jpg"],
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-cream text-charcoal">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-sans text-sm",
            duration: 4000,
            style: {
              background: "#fff",
              color: "#1a1a1a",
              border: "1px solid #e5e0d8",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
