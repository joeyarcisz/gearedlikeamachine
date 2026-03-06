import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AgazulGallery from "./AgazulGallery";

export const metadata: Metadata = {
  title: "Agazul Tequila | Geared Like A Machine",
  description:
    "Product photography and motion content for Agazul Tequila by Geared Like A Machine.",
};

const images = [
  { src: "/agazul/anejo-profile.jpg", alt: "Agazul Tequila Anejo bottle profile in golden light" },
  { src: "/agazul/bar-haze.jpg", alt: "Agazul Tequila bottle and crystal glass with bar haze" },
  { src: "/agazul/blanco-grass.jpg", alt: "Agazul Tequila Blanco in natural grass setting" },
  { src: "/agazul/blanco-product.jpg", alt: "Agazul Tequila Blanco product photography" },
  { src: "/agazul/bottle-grass.jpg", alt: "Agazul Tequila Blanco in grass" },
  { src: "/agazul/bottle-bar.jpg", alt: "Agazul Tequila bar scene" },
];

export default function AgazulTequilaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Product / Commercial
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Agazul Tequila
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              High production value product photography and motion assets for
              Agazul Tequila. Planned, captured, and delivered brand content
              built for screens of all sizes and library archive.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </a>
          </div>

          {/* Gallery */}
          <AgazulGallery images={images} />
        </div>
      </main>
    </>
  );
}
