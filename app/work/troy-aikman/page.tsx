import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Super Bowl | Troy Aikman | Geared Like A Machine",
  description:
    "Super Bowl commercial production featuring NFL legend Troy Aikman by Geared Like A Machine.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Troy Aikman Super Bowl Commercial",
  description: "Super Bowl commercial production featuring NFL legend and Cowboys Hall of Famer Troy Aikman. High-visibility content for broadcast.",
  uploadDate: "2024-01-01",
  productionCompany: { "@type": "Organization", name: "Geared Like A Machine", url: "https://www.gearedlikeamachine.com" },
};

export default function TroyAikmanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Commercial
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Super Bowl | Troy Aikman
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Super Bowl advertising production featuring NFL legend and Dallas
              Cowboys Hall of Famer Troy Aikman. High-visibility commercial
              content built for the biggest stage in broadcast media.
            </p>
            <Link
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </Link>
          </div>

          {/* Placeholder — awaiting production stills */}
          <div className="relative w-full aspect-[21/9] overflow-hidden bg-navy/30 border border-card-border flex items-center justify-center">
            <span className="font-[family-name:var(--font-heading)] text-6xl font-bold text-steel/10">
              05
            </span>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
