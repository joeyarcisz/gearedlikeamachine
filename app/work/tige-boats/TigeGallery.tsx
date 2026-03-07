"use client";

import { useState } from "react";

const heroImage = "/tige/zx-morning-fog.jpg";

const images = [
  "/tige/ultre.gif",
  "/tige/z.gif",
  "/tige/behind-the-scenes.jpg",
  "/tige/z-ladies.gif",
  "/tige/back-boat-slow.gif",
  "/tige/zx-lake-morning.jpeg",
  "/tige/side-boat-slow.gif",
  "/tige/driver-boat-slow.gif",
  "/tige/zx-face-focus.jpg",
  "/tige/clapping.gif",
  "/tige/dive.gif",
];

const allImages = [heroImage, ...images];

export default function TigeGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      {/* Hero — cinematic widescreen banner */}
      <button
        onClick={() => setLightbox(0)}
        className="group relative w-full aspect-[21/9] overflow-hidden bg-navy mb-[2px] cursor-pointer"
      >
        <img
          src={heroImage}
          alt="Tige Boats, Morning Fog"
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
      </button>

      {/* YouTube Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px] mb-[2px]">
        <div className="group relative aspect-video bg-navy grayscale hover:grayscale-0 transition-all duration-500">
          <iframe
            src="https://www.youtube.com/embed/0MPnwiVf33g"
            title="Tige Boats Video 1"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        <div className="group relative aspect-video bg-navy grayscale hover:grayscale-0 transition-all duration-500">
          <iframe
            src="https://www.youtube.com/embed/2A_75bSgtGc"
            title="Tige Boats Video 2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2px]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i + 1)}
            className="group relative aspect-square overflow-hidden bg-navy cursor-pointer"
          >
            <img
              src={src}
              alt={`Tige Boats ${i + 1}`}
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
              src={allImages[lightbox]}
              alt={`Tige Boats ${lightbox + 1}`}
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
            {lightbox < allImages.length - 1 && (
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
