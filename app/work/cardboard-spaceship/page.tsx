import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CardboardSpaceshipGallery from "./CardboardSpaceshipGallery";

export const metadata: Metadata = {
  title: "Cardboard Spaceship | Geared Like A Machine",
  description:
    "Creative production and behind-the-scenes content for Cardboard Spaceship by Geared Like A Machine.",
};

export default function CardboardSpaceshipPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Creative Production
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Cardboard Spaceship
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Behind-the-scenes production coverage capturing the creative
              process from blueprints to build. Workshop walkthroughs, team
              collaboration, and hands-on craftsmanship brought to life through
              motion.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </a>
          </div>

          {/* Gallery */}
          <CardboardSpaceshipGallery />
        </div>
      </main>
    </>
  );
}
