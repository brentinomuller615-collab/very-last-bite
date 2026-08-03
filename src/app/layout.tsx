import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Very Last Bite — Quality Surplus Food. Within Reach.",
  description:
    "Very Last Bite connects people with surplus food from cafés, bakeries, restaurants and delis at the end of each day. Save up to 70% on quality surplus food. Reduce waste. Join the Founding Club today.",
  keywords: [
    "surplus food",
    "food deals",
    "food rescue",
    "affordable food",
    "food waste",
    "founding club",
    "cafe surplus",
  ],
  authors: [{ name: "Very Last Bite" }],
  openGraph: {
    title: "Very Last Bite — Quality Surplus Food. Within Reach.",
    description:
      "Quality surplus food at end-of-day prices. Join the Founding Club and be first in line when we launch.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FEFCFA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
