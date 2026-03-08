import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CocaColaGallery from "./CocaColaGallery";

export const metadata: Metadata = {
  title: "Coca-Cola | Geared Like A Machine",
  description:
    "Coca-Cola Santa Claus commercial production. LED wall stage, multi-day shoot by Geared Like A Machine.",
};

const images = [
  { src: "/coca-cola/santa-1.jpg", alt: "Coca-Cola Santa commercial" },
  { src: "/coca-cola/santa-2.jpg", alt: "Coca-Cola production on LED wall" },
  { src: "/coca-cola/santa-3.jpg", alt: "Coca-Cola Santa close-up" },
  { src: "/coca-cola/santa-4.jpg", alt: "Coca-Cola behind the scenes" },
  { src: "/coca-cola/santa-5.jpg", alt: "Coca-Cola Santa on set" },
  { src: "/coca-cola/santa-6.jpg", alt: "Coca-Cola production lighting" },
  { src: "/coca-cola/santa-7.jpg", alt: "Coca-Cola Santa commercial, final production shot" },
  { src: "/coca-cola/santa-8.jpg", alt: "Coca-Cola Santa commercial production frame" },
];

export default function CocaColaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Commercial
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Coca-Cola
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Director of Photography for the Santa Claus of CCSWB commercial.
              Three-day production including pre-light, rehearsal, and principal
              photography on a 40&apos;x17&apos; LED wall stage with dual RED
              Komodo cameras and a full Aputure lighting rig.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </a>
          </div>

          {/* Gallery */}
          <CocaColaGallery images={images} />
        </div>
      </main>
      <Footer />
    </>
  );
}
