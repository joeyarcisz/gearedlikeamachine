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
  title: "Geared Like A Machine | Dallas-Fort Worth Video Production",
  description:
    "Engineered to Move Audiences. Dallas-Fort Worth's premier video production company crafting cinematic brand films, commercials, and content that drives results. Available nationwide.",
  keywords: [
    "video production",
    "Dallas-Fort Worth",
    "brand films",
    "commercials",
    "social media content",
    "corporate video",
    "DFW videographer",
    "cinema production",
  ],
  openGraph: {
    title: "Geared Like A Machine | Dallas-Fort Worth Video Production",
    description:
      "Engineered to Move Audiences. Cinema-grade video production for brands that demand results.",
    type: "website",
    locale: "en_US",
    siteName: "Geared Like A Machine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geared Like A Machine | Video Production",
    description:
      "Engineered to Move Audiences. Cinema-grade video production in Dallas-Fort Worth.",
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
                "Dallas-Fort Worth video production company specializing in brand films, commercials, and social media content.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What types of video production do you offer?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We offer brand films, commercials, social media content, documentaries, music videos, live event coverage, corporate videos, and paid media assets.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you work with clients outside of Dallas-Fort Worth?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. While based in Dallas-Fort Worth, we work with clients nationwide.",
                  },
                },
              ],
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
