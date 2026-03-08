"use client";

import { useState } from "react";

export default function ChevroletGallery({ gifs }: { gifs: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      {/* Tight grid — eyecannndy-inspired: minimal gaps, edge-to-edge */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[2px]">
        {gifs.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden bg-navy cursor-pointer"
          >
            <img
              src={src}
              alt={`Chevrolet commercial production, frame ${i + 1}`}
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
          <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={gifs[lightbox]}
              alt={`Chevrolet commercial production, frame ${lightbox + 1}`}
              className="w-full h-full object-contain"
            />

            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2 cursor-pointer"
                aria-label="Previous image"
              >
                ‹
              </button>
            )}
            {lightbox < gifs.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2 cursor-pointer"
                aria-label="Next image"
              >
                ›
              </button>
            )}

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white/70 hover:text-white text-xl p-2 cursor-pointer"
              aria-label="Close lightbox"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
