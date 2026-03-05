import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PowerDigitalGallery from "./PowerDigitalGallery";

export const metadata: Metadata = {
  title: "Power Digital — James + James | Geared Like A Machine",
  description:
    "Made For Life — furniture commercial production for James + James, produced for Power Digital by Geared Like A Machine.",
};

const images = [
  { src: "/power-digital/furniture-hero.jpg", alt: "James + James Furniture cinematography" },
  { src: "/power-digital/frame-1.png", alt: "Made For Life commercial frame" },
  { src: "/power-digital/frame-2.jpg", alt: "Furniture production shot" },
  { src: "/power-digital/frame-3.png", alt: "Made For Life production" },
  { src: "/power-digital/frame-4.jpg", alt: "Commercial lighting setup" },
  { src: "/power-digital/frame-5.jpg", alt: "On set behind the scenes" },
  { src: "/power-digital/frame-6.jpg", alt: "Furniture product cinematography" },
  { src: "/power-digital/frame-7.jpg", alt: "Production frame" },
  { src: "/power-digital/frame-8.jpg", alt: "Made For Life scene" },
  { src: "/power-digital/frame-9.jpg", alt: "Final commercial frame" },
];

export default function PowerDigitalPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Brand Content
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Power Digital
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              &ldquo;Made For Life&rdquo; — commercial production for James +
              James Furniture, produced for Power Digital. Producer and Director
              of Photography on a full-scale furniture brand campaign.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </a>
          </div>

          {/* Gallery */}
          <PowerDigitalGallery images={images} />
        </div>
      </main>
    </>
  );
}
