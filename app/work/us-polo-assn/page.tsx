import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import USPAGallery from "./USPAGallery";

export const metadata: Metadata = {
  title: "U.S. Polo Assn. | Geared Like A Machine",
  description:
    "Since 2018, Geared Like A Machine has captured high-impact global motion assets for U.S. Polo Assn. seasonal campaigns distributed across 190+ countries.",
};

export default function USPAPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Global Campaign
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              U.S. Polo Assn.
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto mb-4 leading-relaxed">
              Since 2018, we&apos;ve worked with U.S. Polo Assn. and Genius House Media, capturing high-impact global motion assets for the brand&apos;s seasonal campaigns. The official brand of the United States Polo Association has a presence in over 190 countries and USPA distributes these assets to all of them.
            </p>
            <a
              href="/#portfolio"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              ← Back to Portfolio
            </a>
          </div>

          {/* Gallery */}
          <USPAGallery />
        </div>
      </main>
    </>
  );
}
