import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RentalInventory from "@/components/RentalInventory";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Equipment Rentals | Geared Like A Machine",
  description:
    "Browse our full equipment rental inventory — cameras, lenses, lighting, drones, grip, audio, monitoring, and more. Daily rates for professional production gear.",
  openGraph: {
    title: "Equipment Rentals | Geared Like A Machine",
    description:
      "Professional production equipment available for daily rental. 150+ items across cameras, lighting, lenses, drones, grip, and more.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

export default function RentalsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">
              Production Equipment
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-6">
              Equipment Rentals
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Our rental department carries cameras, lenses, lighting, drones,
              grip, audio, monitoring, power, and support gear — everything you
              need to execute at the highest level.
            </p>
          </div>
        </section>

        {/* Inventory */}
        <RentalInventory />

        {/* CTA */}
        <section className="py-16 sm:py-24 bg-black border-t border-card-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4">
              Need Gear for Your Next Shoot?
            </h2>
            <p className="text-muted text-sm sm:text-base mb-8 leading-relaxed">
              Reach out to reserve equipment or build a custom package for your
              production. We&apos;ll put together exactly what you need.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=Equipment%20Rental%20Inquiry`}
              className="inline-block bg-steel text-black px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200"
            >
              Inquire About Rentals
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
