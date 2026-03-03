"use client";

import { useState } from "react";

const galleryImages = [
  { src: "/dashboard/agazul-anejo.jpg", title: "Agazul Tequila", category: "Product" },
  { src: "/dashboard/hayabusa.jpg", title: "Hayabusa", category: "Automotive" },
  { src: "/dashboard/colorado.jpg", title: "Colorado", category: "Landscape" },
  { src: "/dashboard/basketball.jpg", title: "Athlete", category: "Sports" },
  { src: "/dashboard/malibu-horse.jpg", title: "U.S. Polo Assn.", category: "Apparel" },
  { src: "/dashboard/lake-austin.jpg", title: "Lake Austin", category: "Lifestyle" },
  { src: "/dashboard/uspa-barn.jpg", title: "USPA Barn", category: "Fashion" },
  { src: "/dashboard/bts-crew.jpg", title: "Behind the Scenes", category: "BTS" },
  { src: "/dashboard/utah.jpg", title: "Utah", category: "Landscape" },
  { src: "/dashboard/charleston-dock.jpg", title: "Charleston", category: "Fashion" },
  { src: "/dashboard/street-denim.jpg", title: "Street Denim", category: "Apparel" },
  { src: "/dashboard/cinematographer.jpg", title: "Cinematographer", category: "BTS" },
  { src: "/dashboard/hayabusa-2.jpg", title: "Hayabusa II", category: "Automotive" },
  { src: "/dashboard/agazul-bar.jpg", title: "Agazul Bar", category: "Product" },
  { src: "/dashboard/featured-hero.jpg", title: "Featured", category: "Campaign" },
  { src: "/dashboard/leica-01.jpg", title: "Leica Series", category: "Portrait" },
];

const categories = ["All", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

export default function GalleryPanel() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "All" ? galleryImages : galleryImages.filter((img) => img.category === active);

  return (
    <div
      className="dashboard-card"
      style={{ "--card-delay": "350ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header justify-between">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Gallery — Stills & Production
        </span>
        <span className="text-chrome/50 text-[10px]">{filtered.length} images</span>
      </div>

      {/* Category filter tabs */}
      <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border transition-colors font-[family-name:var(--font-heading)] ${
              active === cat
                ? "border-steel text-steel bg-steel/10"
                : "border-card-border text-muted hover:text-white hover:border-white/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div className="dashboard-card-body grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-1.5">
        {filtered.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden bg-navy cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
              style={{ backgroundImage: `url('${img.src}')` }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-[family-name:var(--font-heading)] text-[9px] uppercase tracking-wide text-white truncate">
                {img.title}
              </p>
              <p className="text-steel text-[8px] uppercase tracking-widest">
                {img.category}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].title}
              className="w-full h-full object-contain grayscale"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-wide text-white">
                {filtered[lightbox].title}
              </p>
              <p className="text-steel text-xs uppercase tracking-widest">
                {filtered[lightbox].category}
              </p>
            </div>

            {/* Nav arrows */}
            {lightbox > 0 && (
              <button
                onClick={() => setLightbox(lightbox - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
              >
                ‹
              </button>
            )}
            {lightbox < filtered.length - 1 && (
              <button
                onClick={() => setLightbox(lightbox + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
              >
                ›
              </button>
            )}

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-2 right-2 text-white/70 hover:text-white text-xl p-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
