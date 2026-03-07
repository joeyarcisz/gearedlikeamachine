"use client";

import { useState } from "react";

const images = [
  "/uspa/polo%20logo.gif",
  "/uspa/polo.gif",
  "/uspa/horses.gif",
  "/uspa/polo%20horse%20colorado.gif",
  "/uspa/polo%20horse%20florida.gif",
  "/uspa/polo%20pitch.gif",
  "/uspa/polo%20running.gif",
  "/uspa/polo%20slow%20shutter.gif",
  "/uspa/polo%20shoulders.gif",
  "/uspa/polo%20california.gif",
  "/uspa/polo%20couple%20colorado.gif",
  "/uspa/polo%20couple%20santa%20monica.gif",
  "/uspa/chloe%20polo.gif",
  "/uspa/botanical%20garden.gif",
  "/uspa/sun%20flower.gif",
  "/uspa/shadows.gif",
  "/uspa/selfie.gif",
  "/uspa/spin.gif",
  "/uspa/wink.gif",
  "/uspa/peek%20a%20boo.gif",
  "/uspa/a%20group%20hangs%20out%20by%20a%20lifeguard%20tower%20in%20miami.gif",
  "/uspa/a%20group%20has%20fun%20in%20the%20winter.gif",
  "/uspa/a%20group%20has%20fun%20in%20the%20winter2.gif",
  "/uspa/a%20group%20poses%20in%20front%20of%20some%20trees.gif",
  "/uspa/a%20group%20takes%20photos%20on%20a%20stair%20set.gif",
  "/uspa/house%20tahoe.gif",
  "/uspa/tahoe.gif",
  "/uspa/red%20truck.gif",
  "/uspa/USPA%20|%20joeyarcisz.com%20commercial%20filmmaker%20dallas%20texas%20|%20airstream%20fashion.gif",
  "/uspa/uspa%20fw24%20magnify.gif",
  "/uspa/uspa%20fw24%20snow.gif",
  "/uspa/Joey%20Arcisz_USPAgarden00222371garden.jpeg",
  "/uspa/Joey%20Arcisz_USPAstreet%20denim00302559street-2.jpeg",
  "/uspa/Joey%20Arcisz_USPAV1-0025_dunlin01029715charleston.jpeg",
  "/uspa/Joey%20Arcisz_USPAV1-0049_dock01403870charleston.jpeg",
  "/uspa/Utah-JoeyArcisz.jpg",
];

export default function USPAGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2px]">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden bg-navy cursor-pointer"
          >
            <img
              src={src}
              alt={`U.S. Polo Assn. ${i + 1}`}
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
              src={images[lightbox]}
              alt={`U.S. Polo Assn. ${lightbox + 1}`}
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
            {lightbox < images.length - 1 && (
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
