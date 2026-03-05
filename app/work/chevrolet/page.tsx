import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ChevroletGallery from "./ChevroletGallery";

export const metadata: Metadata = {
  title: "Chevrolet | Geared Like A Machine",
  description:
    "Chevrolet commercial production gallery by Geared Like A Machine.",
};

const gifs = [
  "/chevrolet/chevy1.gif",
  "/chevrolet/chevy2.gif",
  "/chevrolet/chevy3.gif",
  "/chevrolet/chevy4.gif",
  "/chevrolet/chevy5.gif",
  "/chevrolet/chevy6.gif",
  "/chevrolet/chevy7.gif",
  "/chevrolet/chevy8.gif",
  "/chevrolet/chevy10.gif",
];

export default function ChevroletPage() {
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
              Chevrolet
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Commercial production for Chevrolet. High-energy campaign content
              capturing vehicles, lifestyle, and brand moments built for
              broadcast and digital distribution.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              ← Back to Portfolio
            </a>
          </div>

          {/* Tight grid gallery */}
          <ChevroletGallery gifs={gifs} />
        </div>
      </main>
    </>
  );
}
