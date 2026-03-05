import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gearedlikeamachine.com"),
  title: "Geared Like A Machine | Video Production & Equipment Rentals",
  description:
    "Engineered to Move Audiences. Cinema-grade video production, equipment rentals, and content creation for brands that demand results. Based in Texas, working globally.",
  keywords: [
    "video production",
    "equipment rentals",
    "brand films",
    "commercials",
    "social media content",
    "corporate video",
    "cinema production",
    "production gear rental",
  ],
  openGraph: {
    title: "Geared Like A Machine | Video Production & Equipment Rentals",
    description:
      "Engineered to Move Audiences. Cinema-grade video production and professional equipment rentals for brands that demand results. Based in Dallas-Fort Worth, Texas.",
    type: "website",
    locale: "en_US",
    siteName: "Geared Like A Machine",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Geared Like A Machine — Video Production & Equipment Rentals" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geared Like A Machine | Video Production & Equipment Rentals",
    description:
      "Engineered to Move Audiences. Cinema-grade video production and professional equipment rentals. Dallas-Fort Worth, TX.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Geared Like A Machine",
              description:
                "Video production company and equipment rental house specializing in brand films, commercials, and social media content. Based in Dallas-Fort Worth, Texas. Working globally.",
              telephone: "(682) 229-7699",
              email: "hello@gearedlikeamachine.com",
              url: "https://gearedlikeamachine.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dallas-Fort Worth",
                addressRegion: "TX",
                addressCountry: "US",
              },
              areaServed: "United States",
              priceRange: "$$",
            }),
          }}
        />
      </head>
      <body
        className={`${rajdhani.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
