import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "Dallas Video Production Company | Geared Like A Machine",
  description:
    "Full-service video production in Dallas, TX. Commercial, corporate, documentary, and short-form content.",
  openGraph: {
    title: "Dallas Video Production Company | Geared Like A Machine",
    description:
      "Full-service video production in Dallas, TX. Commercial, corporate, documentary, and short-form content.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

const services = [
  {
    title: "Commercial",
    description:
      "High-impact commercials for broadcast, digital, and social. From concept through final delivery, built for the DFW advertising ecosystem.",
  },
  {
    title: "Corporate",
    description:
      "Internal communications, recruitment films, executive messaging, and investor content for Dallas headquarters and regional offices.",
  },
  {
    title: "Documentary",
    description:
      "Long-form storytelling for brands, nonprofits, and cultural institutions. Multi-day shoots, archival integration, and full post-production.",
  },
  {
    title: "Short-Form",
    description:
      "Platform-native content for social, paid media, and digital campaigns. Engineered for performance across every algorithm.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We learn your objectives, audience, and timeline. Every project starts with a thorough intake.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Creative direction, scripting, shot lists, and logistics. Everything mapped before a camera rolls.",
  },
  {
    number: "03",
    title: "Produce",
    description: "Vetted crews, cinema-grade equipment, and efficient operations. Precision on set, every time.",
  },
  {
    number: "04",
    title: "Deliver",
    description: "Edit, color, sound, graphics, and platform-optimized exports. Final assets ready for deployment.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "Geared Like A Machine",
      url: "https://gearedlikeamachine.com/dallas-video-production",
      telephone: "(682) 229-7699",
      email: "joey@gearedlikeamachine.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dallas",
        addressRegion: "TX",
        addressCountry: "US",
      },
      areaServed: {
        "@type": "City",
        name: "Dallas",
      },
      priceRange: "$$",
    },
    {
      "@type": "Service",
      name: "Dallas Video Production",
      provider: {
        "@type": "LocalBusiness",
        name: "Geared Like A Machine",
      },
      serviceType: "Video Production",
      areaServed: {
        "@type": "City",
        name: "Dallas",
      },
      description:
        "Full-service video production in Dallas, TX. Commercial, corporate, documentary, and short-form content.",
    },
  ],
};

export default function DallasVideoProductionPage() {
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
                Dallas Video Production
              </h1>
              <div className="w-12 h-0.5 bg-steel my-4" />
              <p className="text-chrome text-base sm:text-lg leading-relaxed max-w-2xl">
                Full-service video production rooted in Dallas, TX. We produce
                commercial, corporate, documentary, and short-form content for
                brands operating across the DFW metroplex and beyond.
              </p>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                Production Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="border border-card-border bg-card p-5"
                  >
                    <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wider uppercase text-steel mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* Why GLM in Dallas */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                Why GLM in Dallas
              </h2>
              <div className="space-y-6 text-chrome text-[15px] sm:text-base leading-relaxed">
                <p>
                  Dallas is one of the fastest-growing production markets in the
                  country, and for good reason. The city sits at the center of a
                  corporate corridor that includes Fortune 500 headquarters,
                  global financial institutions, major healthcare systems, and a
                  technology sector that has been expanding year over year. When
                  companies in these industries need video content, they need a
                  production partner that understands both the creative demands
                  and the business context behind the work. That is where we
                  operate. We have spent years embedded in the Dallas production
                  landscape, learning the infrastructure, building relationships
                  with crews and facilities, and producing content that reflects
                  the standards these organizations expect. The result is a
                  production company that does not need to ramp up when a Dallas
                  project lands on the schedule. We are already here, already
                  connected, and already familiar with what it takes to deliver
                  in this market.
                </p>

                <p>
                  The DFW agency ecosystem is one of the most active in the
                  southern United States. Dallas is home to regional offices for
                  national agencies, boutique creative shops, and in-house brand
                  teams that regularly produce content at scale. We work across
                  all of these channels. Whether it is a campaign originating
                  from a downtown agency, a branded content series for a
                  corporate marketing department, or a direct-to-brand engagement
                  with a company that wants to bypass the agency layer entirely,
                  we bring the same level of precision and production value.
                  Dallas production schedules move fast, especially in the tech
                  and finance sectors where quarterly content calendars dictate
                  timelines. Our operations are designed for that pace. We scope
                  efficiently, crew up from a deep local bench, and execute on
                  tight turnarounds without sacrificing the quality of the
                  finished product.
                </p>

                <p>
                  From a location standpoint, Dallas offers a range that most
                  cities cannot match. The Deep Ellum arts district provides
                  textured urban backdrops for lifestyle and music-driven
                  content. The downtown core, with its glass towers and modern
                  architecture, serves corporate and financial productions that
                  need a polished, metropolitan look. The Design District and
                  Trinity Groves bring a creative edge for branded content and
                  product shoots. Moving north along the tech corridor through
                  Plano, Frisco, and Richardson, the landscape shifts toward
                  campuses and innovation centers that are increasingly in demand
                  for recruitment videos, product demos, and internal
                  communications. We have shot in all of these environments and
                  understand the permitting, logistics, and visual language of
                  each. That local knowledge translates directly into smoother
                  production days, fewer surprises, and content that feels
                  authentic to the location.
                </p>

                <p>
                  What sets us apart in the Dallas market is not just local
                  presence. It is a combination of technical depth, operational
                  efficiency, and a perspective that comes from working across
                  every format and scale. We own and maintain a professional
                  equipment inventory, which means we are not dependent on
                  third-party rental houses for core production gear. Our post-
                  production pipeline handles editorial, color grading, sound
                  design, motion graphics, and final delivery in-house, keeping
                  quality control tight from the first frame to the last export.
                  Dallas is a market where brands expect professionalism,
                  reliability, and results. That is exactly how we operate, and
                  it is why organizations across DFW continue to trust us with
                  the content that represents their business to the world.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                How We Work
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
                Start Your Dallas Project
              </h2>
              <p className="text-chrome text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Ready to produce something worth watching? Tell us about your
                project and we will follow up within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/discovery"
                  className="bg-steel text-black px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
                >
                  Start a Project
                </Link>
                <Link
                  href="/scope"
                  className="border border-card-border text-steel px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:border-steel transition-colors"
                >
                  Get an Estimate
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
