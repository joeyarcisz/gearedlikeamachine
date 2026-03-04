"use client";

import { useState } from "react";

const images = [
  "/cardboard-spaceship/projecting%20blueprints.gif",
  "/cardboard-spaceship/rolling%20out%20blueprints.gif",
  "/cardboard-spaceship/pointing%20blueprints.gif",
  "/cardboard-spaceship/talking%20over%20blueprints.gif",
  "/cardboard-spaceship/ipad%20talk.gif",
  "/cardboard-spaceship/messy%20table.gif",
  "/cardboard-spaceship/saw%20pov.gif",
  "/cardboard-spaceship/top%20down.gif",
  "/cardboard-spaceship/looking%20around.gif",
  "/cardboard-spaceship/follow.gif",
  "/cardboard-spaceship/paralax.gif",
  "/cardboard-spaceship/push2.gif",
];

export default function CardboardSpaceshipGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2px]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden bg-navy cursor-pointer"
          >
            <img
              src={src}
              alt={`Cardboard Spaceship ${i + 1}`}
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
              src={images[lightbox]}
              alt={`Cardboard Spaceship ${lightbox + 1}`}
              className="w-full h-full object-contain"
            />

            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
              >
                &#8249;
              </button>
            )}
            {lightbox < images.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
              >
                &#8250;
              </button>
            )}

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white/70 hover:text-white text-xl p-2"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
