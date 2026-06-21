import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Very Last Bite — Discover Surplus Food Deals Near You",
  description:
    "Spin to discover discounted surplus food from nearby restaurants, cafés, bakeries, and grocery stores. Save money. Save food. Very Last Bite.",
  keywords: ["surplus food", "food deals", "food waste", "discount meals", "rescue food"],
  authors: [{ name: "Very Last Bite" }],
  openGraph: {
    title: "Very Last Bite",
    description: "Spin to discover surplus food deals near you.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0a00",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
