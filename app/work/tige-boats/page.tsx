import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TigeGallery from "./TigeGallery";

export const metadata: Metadata = {
  title: "Tige Boats | Geared Like A Machine",
  description:
    "Brand films, behind-the-scenes coverage, and lifestyle content for Tige Boats by Geared Like A Machine.",
};

export default function TigeBoatsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Marine / Watersports
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Tige Boats
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Brand films, behind-the-scenes coverage, and lifestyle content
              for Tige Boats. From cinematic spots to on-water production
              capturing performance watercraft, dynamic tracking shots, aerial
              coverage, and athlete-driven storytelling.
            </p>
            <Link
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </Link>
          </div>

          {/* Gallery */}
          <TigeGallery />
        </div>
      </main>
      <Footer />
    </>
  );
}
