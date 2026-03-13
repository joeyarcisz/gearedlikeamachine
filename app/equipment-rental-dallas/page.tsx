import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "Camera & Equipment Rental Dallas | Geared Like A Machine",
  description:
    "Cinema camera, lens, lighting, and grip rental in Dallas-Fort Worth. Curated packages and same-day pickup.",
  openGraph: {
    title: "Camera & Equipment Rental Dallas | Geared Like A Machine",
    description:
      "Cinema camera, lens, lighting, and grip rental in Dallas-Fort Worth. Curated packages and same-day pickup.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

const rentalCategories = [
  {
    title: "Cinema Cameras",
    description:
      "RED V-Raptor, RED Komodo-X, Sony FX series, and Nikon cinema bodies. Every camera prepped, tested, and ready for production with batteries, media, and rigging included.",
  },
  {
    title: "Lighting",
    description:
      "Aputure, Nanlite, and ARRI LED fixtures for every scale of production. Continuous, bi-color, and RGB options with stands, modifiers, and power distribution.",
  },
  {
    title: "Grip & Electric",
    description:
      "C-stands, flags, frames, silks, solids, apple boxes, and sandbags. Full grip packages for studio and location work across the DFW metroplex.",
  },
  {
    title: "Curated Packages",
    description:
      "Pre-built gear bundles designed for specific production types. One price, everything included, no line-item headaches. Browse our full package list on the rentals page.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "Tell us what you are shooting. We will recommend the right gear for your project, budget, and format.",
  },
  {
    number: "02",
    title: "Plan",
    description: "We confirm availability, prep your order, and lock in dates. Packages or custom builds, your call.",
  },
  {
    number: "03",
    title: "Produce",
    description: "Pick up your gear, fully prepped and tested. Same-day availability for most items in the DFW area.",
  },
  {
    number: "04",
    title: "Deliver",
    description: "Return when wrapped. We handle inspection, turnover, and get you back to work without delays.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "Geared Like A Machine",
      url: "https://gearedlikeamachine.com/equipment-rental-dallas",
      telephone: "(682) 229-7699",
      email: "hello@gearedlikeamachine.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dallas",
        addressRegion: "TX",
        addressCountry: "US",
      },
      areaServed: {
        "@type": "City",
        name: "Dallas-Fort Worth",
      },
      priceRange: "$$",
    },
    {
      "@type": "Product",
      name: "Camera & Equipment Rental",
      brand: {
        "@type": "Brand",
        name: "Geared Like A Machine",
      },
      description:
        "Cinema camera, lens, lighting, and grip rental in Dallas-Fort Worth. Professional production equipment with curated packages and same-day pickup.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        offerCount: "100+",
      },
    },
  ],
};

export default function EquipmentRentalDallasPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 bg-black min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <p className="font-mono text-xs text-muted tracking-[3px] uppercase mb-4">
                GLM &middot; TEXAS
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider uppercase text-white mb-4">
                Camera &amp; Equipment Rental in Dallas
              </h1>
              <div className="w-12 h-0.5 bg-steel my-4" />
              <p className="text-chrome text-base sm:text-lg leading-relaxed max-w-2xl">
                Professional cinema cameras, lenses, lighting, and grip equipment
                available for rent in Dallas-Fort Worth. Curated packages, same-day
                pickup, and support from people who use this gear every day.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Rental Categories Grid */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                What We Rent
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rentalCategories.map((category) => (
                  <div
                    key={category.title}
                    className="border border-card-border bg-card p-5"
                  >
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wider uppercase text-steel mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/rentals"
                  className="text-steel text-sm uppercase tracking-widest hover:text-white transition-colors"
                >
                  Browse Full Inventory &rarr;
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Why GLM for Rentals in DFW */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                The DFW Rental Landscape
              </h2>
              <div className="space-y-6 text-chrome text-[15px] sm:text-base leading-relaxed">
                <p>
                  Dallas-Fort Worth is one of the most active production markets
                  in the southern United States, but the equipment rental
                  experience in this region has not kept pace with the demand.
                  Most rental houses in DFW operate on a traditional model:
                  limited online inventory visibility, slow quote-back processes,
                  inconsistent gear prep, and support staff who may not have
                  hands-on production experience with the equipment they are
                  renting out. We built our rental operation specifically to
                  address these gaps. Every piece of equipment in our inventory
                  is maintained, tested, and prepped by people who use it on
                  professional sets. When you pick up a camera package from us,
                  it has been powered on, sensor-checked, and packed with every
                  accessory you need to start shooting immediately. That level of
                  preparation is not an add-on service. It is the baseline.
                </p>

                <p>
                  The DFW production community includes independent filmmakers,
                  commercial production companies, corporate video teams,
                  content creators, and agency producers who all share a common
                  need: reliable access to professional equipment without the
                  friction that typically comes with the rental process. We have
                  designed our operation to eliminate that friction at every
                  step. Our inventory is visible and browsable online, pricing is
                  transparent, and availability is confirmed quickly. For
                  productions that need gear on short notice, same-day pickup is
                  available for most items in our catalog. Weekend rates are
                  structured fairly: pick up Friday after 2 PM, return Monday by
                  11 AM, and it counts as a single day. Weekly rentals are priced
                  at three times the daily rate. These policies are designed for
                  the way productions actually work, not for the way rental
                  houses wish they worked.
                </p>

                <p>
                  What makes our rental offering different is that it is backed
                  by active production experience. We are not a warehouse
                  operation staffed by people who process orders. We are a
                  production company that rents equipment from the same inventory
                  we use on our own shoots. That means we can advise on lens
                  selection for a specific camera system, recommend lighting
                  setups for a particular location type, and troubleshoot
                  technical issues because we have encountered them firsthand.
                  When a DP calls to ask whether a particular lens covers full
                  frame on a specific body, or whether an LED fixture is bright
                  enough for a daylight exterior at a given distance, we can
                  answer from experience, not from a spec sheet. That kind of
                  support is rare in the rental business, and it is something
                  the DFW production community has been asking for.
                </p>

                <p>
                  Texas continues to grow as a production destination. State
                  incentives, lower cost of living compared to LA and New York,
                  and a deep talent pool are bringing more productions to the
                  region every year. As the market expands, the demand for
                  professional rental equipment grows with it. We are investing
                  in our inventory and expanding our curated package offerings to
                  serve that growth. Whether you are a local DP who needs a lens
                  swap for a weekend shoot, a production company crewing up for
                  a multi-day commercial, or a content team that needs a turnkey
                  lighting and camera package for a studio build, we have the
                  gear, the knowledge, and the operational structure to support
                  your production. DFW deserves a rental house that operates at
                  the same standard as the productions it serves, and that is
                  exactly what we are building.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                How It Works
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps.map((step) => (
                  <div key={step.number} className="border border-card-border bg-card p-4">
                    <span className="text-xl font-bold text-steel opacity-30 block mb-2">
                      {step.number}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wider uppercase text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-muted text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold tracking-wider uppercase text-white mb-4">
                Start Your DFW Rental
              </h2>
              <p className="text-chrome text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Need gear for an upcoming production? Browse the full inventory
                or tell us what you are shooting and we will build a package.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/discovery"
                  className="bg-steel text-black px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
                >
                  Request a Rental
                </Link>
                <Link
                  href="/rentals"
                  className="border border-card-border text-steel px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:border-steel transition-colors"
                >
                  Browse Inventory
                </Link>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
