import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarlinkGallery from "./StarlinkGallery";

export const metadata: Metadata = {
  title: "SpaceX Starlink | Geared Like A Machine",
  description:
    "Product demonstration and production content for SpaceX Starlink by Geared Like A Machine.",
};

const images = [
  { src: "/starlink/demo.gif", alt: "Starlink product demonstration" },
  { src: "/starlink/phone-app.jpg", alt: "Starlink app setup on iPhone" },
  { src: "/starlink/setup-1.jpg", alt: "Starlink production setup" },
  { src: "/starlink/setup-2.jpg", alt: "Starlink field deployment" },
  { src: "/starlink/setup-3.jpg", alt: "Starlink on location" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "SpaceX Starlink Product Demonstration",
  description: "Product demonstration content for SpaceX Starlink. First freelance DP hired by Starlink for multi-location production in Austin, Texas.",
  thumbnailUrl: "https://www.gearedlikeamachine.com/starlink/demo.gif",
  uploadDate: "2023-01-01",
  productionCompany: { "@type": "Organization", name: "Geared Like A Machine", url: "https://www.gearedlikeamachine.com" },
};

export default function SpaceXStarlinkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Product Demo
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              SpaceX Starlink
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Product demonstration content for one of the most defining
              innovations in modern technology. Served as the first freelance DP
              hired by Starlink, leading production, gear, crew, logistics, and
              coordination across multiple locations in Austin, Texas.
            </p>
            <Link
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </Link>
          </div>

          {/* Hero Video */}
          <div className="w-full aspect-video mb-[2px] overflow-hidden">
            <iframe
              src="https://player.vimeo.com/video/820936331?h=f8b917f794&title=0&byline=0&portrait=0"
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Gallery */}
          <StarlinkGallery images={images} />
        </div>
      </main>
      <Footer />
    </>
  );
}
