import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KubotaGallery from "./KubotaGallery";

export const metadata: Metadata = {
  title: "Kubota | Geared Like A Machine",
  description:
    "Multi-location commercial production for Kubota across Texas, Tennessee, Kansas, and Georgia.",
};

export default function KubotaPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Commercial / Industrial
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-3">
              Kubota
            </h1>
            <p className="text-chrome text-sm sm:text-base mb-2">
              Director of Photography
            </p>
            <p className="text-muted text-xs uppercase tracking-widest mb-4">
              Grapevine, TX · Murfreesboro, TN · Abilene, KS · Jefferson, GA
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Work
            </a>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px] mb-[2px]">
            <div className="relative aspect-video bg-navy">
              <iframe
                src="https://www.youtube.com/embed/ZVyoOsreOMg"
                title="Kubota Video 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="relative aspect-video bg-navy">
              <iframe
                src="https://www.youtube.com/embed/GJSkOZVGdh4"
                title="Kubota Video 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px] mb-[2px]">
            <div className="relative aspect-video bg-navy">
              <iframe
                src="https://www.youtube.com/embed/Vp-ftvJ2lY4"
                title="Kubota Video 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Image Gallery */}
          <KubotaGallery />
        </div>
      </main>
      <Footer />
    </>
  );
}
