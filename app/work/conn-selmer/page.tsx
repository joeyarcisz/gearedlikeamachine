import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConnSelmerGallery from "./ConnSelmerGallery";

export const metadata: Metadata = {
  title: "Conn-Selmer | Geared Like A Machine",
  description:
    "Producer and DP for Conn-Selmer and MusicProfessor.com. 4 production days, 8 musicians, 150+ video lessons.",
};

export default function ConnSelmerPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Music / Education
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-3">
              Conn-Selmer
            </h1>
            <p className="text-chrome text-sm sm:text-base mb-2">
              Producer / Director of Photography
            </p>
            <p className="text-muted text-sm mb-4">
              In partnership with MusicProfessor.com
            </p>

            {/* Project Stats */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
              <div className="text-center">
                <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white">
                  4
                </p>
                <p className="text-muted text-xs uppercase tracking-widest">
                  Production Days
                </p>
              </div>
              <div className="w-px h-10 bg-card-border" />
              <div className="text-center">
                <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white">
                  8
                </p>
                <p className="text-muted text-xs uppercase tracking-widest">
                  Musicians
                </p>
              </div>
              <div className="w-px h-10 bg-card-border" />
              <div className="text-center">
                <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white">
                  150+
                </p>
                <p className="text-muted text-xs uppercase tracking-widest">
                  Video Lessons
                </p>
              </div>
            </div>

            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Work
            </a>
          </div>

          {/* Testimonial Card */}
          <div className="border border-card-border bg-card p-6 max-w-3xl mx-auto mb-8">
            <blockquote>
              <p className="text-chrome text-sm sm:text-base leading-relaxed italic mb-3">
                &ldquo;You set such an exceptionally high standard that is now
                what I demand from the crews I work with&rdquo;
              </p>
              <cite className="text-muted text-xs uppercase tracking-widest not-italic">
                — Elisa Janson Jones, Senior Product Manager - Digital,
                Conn-Selmer
              </cite>
            </blockquote>
          </div>

          {/* Screenshot Gallery */}
          <ConnSelmerGallery />
        </div>
      </main>
      <Footer />
    </>
  );
}
