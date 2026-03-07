"use client";

import { useRef } from "react";
import Image from "next/image";
import ScrollFadeIn from "./ScrollFadeIn";

const galleryImages = [
  { src: "/gallery/warehouse-silhouette.jpg", alt: "Crew silhouettes in warehouse doorway", aspect: "landscape" },
  { src: "/gallery/tige-showroom.jpg", alt: "Blue-lit production in Tige Boats showroom", aspect: "landscape" },
  { src: "/gallery/uspa-garden.jpg", alt: "Fashion portrait for U.S. Polo Assn.", aspect: "landscape" },
  { src: "/gallery/uspa-denim.jpg", alt: "Lifestyle campaign with palm trees", aspect: "landscape" },
  { src: "/gallery/uspa-malibu-horse.jpg", alt: "Horseback on Malibu beach at sunset", aspect: "landscape" },
  { src: "/gallery/tige-lake-austin.jpg", alt: "Tige boat on Lake Austin at golden hour", aspect: "landscape" },
  { src: "/gallery/basketball-overhead.jpg", alt: "Overhead basketball hoop creative shot", aspect: "landscape" },
  { src: "/gallery/camera-rig-bokeh.jpg", alt: "Cinema camera rig with bokeh lights", aspect: "landscape" },
  { src: "/gallery/colorado-mountains.jpg", alt: "Aerial of Colorado mountains for USPA", aspect: "landscape" },
  { src: "/gallery/red-camera-neon.jpg", alt: "RED camera with neon LED environment", aspect: "portrait" },
];

export default function ImageGalleryStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 sm:py-24 bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <ScrollFadeIn>
          <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
            Through the Lens
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider">
            On Set
          </h2>
        </ScrollFadeIn>
      </div>

      {/* Masonry grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 sm:gap-3">
          {galleryImages.map((img, i) => (
            <ScrollFadeIn key={img.src} delay={i * 60}>
              <div className="mb-2 sm:mb-3 break-inside-avoid overflow-hidden group">
                <div className="relative overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={img.aspect === "portrait" ? 1067 : 533}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>

      {/* Horizontal scroll strip below masonry */}
      <div className="mt-8 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-1 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
        >
          {galleryImages.map((img) => (
            <div
              key={`strip-${img.src}`}
              className="flex-shrink-0 snap-start w-[280px] sm:w-[360px] h-[160px] sm:h-[200px] relative overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="360px"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
