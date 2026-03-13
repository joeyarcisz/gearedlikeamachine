import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconStar } from "@/components/icons";

export const metadata: Metadata = {
  title: "JFK: The Unspoken Speech | Geared Like A Machine",
  description:
    "ADDY Best of Show winning documentary. Winner of Gold ADDY in Public Service Audio/visual.",
};

export default function JFKPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Video Hero */}
          <div className="relative w-full aspect-video overflow-hidden bg-navy mb-8">
            <iframe
              src="https://player.vimeo.com/video/76923179?title=0&byline=0&portrait=0"
              title="JFK: The Unspoken Speech"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Header */}
          <div className="max-w-3xl mx-auto">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Documentary
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-6">
              The Unspoken Speech
            </h1>

            {/* Award Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-card-border bg-card mb-6">
              <IconStar className="w-4 h-4 text-steel" />
              <span className="text-steel text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] font-bold">
                ADDY Best of Show 2014
              </span>
            </div>

            {/* Description */}
            <p className="text-muted text-sm sm:text-base leading-relaxed mb-8">
              Winner of the 2014 ADDY Best of Show Broadcast award for editing
              and a Gold ADDY in the Public Service Audio/visual category.
            </p>

            {/* JFK Pull Quote */}
            <blockquote className="border-l-2 border-steel pl-4 mb-8">
              <p className="text-chrome text-sm sm:text-base leading-relaxed italic mb-3">
                &ldquo;Above all, words alone are not enough. The United States
                is a peaceful nation. And where our strength and determination
                are clear, our words need merely to convey conviction, not
                belligerence. If we are strong, our strength will speak for
                itself. If we are weak, words will be of no help.&rdquo;
              </p>
              <cite className="text-muted text-xs uppercase tracking-widest not-italic">
                — President John F. Kennedy
              </cite>
            </blockquote>

            {/* BTS Image */}
            <div className="relative w-full aspect-[21/9] overflow-hidden bg-navy mb-8">
              <img
                src="/jfk/hero.webp"
                alt="Behind the scenes, JFK: The Unspoken Speech documentary production"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Back Link */}
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Work
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
