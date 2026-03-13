"use client";

import { useState } from "react";

const images = Array.from({ length: 14 }, (_, i) => ({
  src: `/conn-selmer/${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Conn-Selmer video lesson screenshot ${i + 1}`,
}));

export default function ConnSelmerGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      {/* Grid — 2-col desktop, 1-col mobile, 16:9 aspect ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-video overflow-hidden bg-navy cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              className="w-full h-full object-contain"
            />

            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2 cursor-pointer"
                aria-label="Previous image"
              >
                &#8249;
              </button>
            )}
            {lightbox < images.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2 cursor-pointer"
                aria-label="Next image"
              >
                &#8250;
              </button>
            )}

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white/70 hover:text-white text-xl p-2 cursor-pointer"
              aria-label="Close lightbox"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
