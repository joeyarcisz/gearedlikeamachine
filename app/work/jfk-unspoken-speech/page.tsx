import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "JFK: The Unspoken Speech | Geared Like A Machine",
  description:
    "Award-winning documentary production bringing JFK's unspoken 1963 Dallas speech to life. 2014 ADDY Best of Show.",
};

export default function JFKPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Documentary
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              JFK: The Unspoken Speech
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              A preserved piece of American history. Documentary production
              bringing President Kennedy&apos;s undelivered 1963 Dallas Trade
              Mart speech to life through archival footage, intimate interviews,
              and a compelling narrative arc. Winner of the 2014 ADDY Best of
              Show in Broadcast.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; Back to Portfolio
            </a>
          </div>

          {/* Hero image */}
          <div className="relative w-full aspect-[21/9] overflow-hidden bg-navy">
            <img
              src="/jfk/featured.jpg"
              alt="JFK: The Unspoken Speech"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </>
  );
}
