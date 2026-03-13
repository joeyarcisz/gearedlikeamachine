import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "Fort Worth Video Production | Geared Like A Machine",
  description:
    "Video production services in Fort Worth, TX. Commercial, documentary, corporate video, and branded content.",
  openGraph: {
    title: "Fort Worth Video Production | Geared Like A Machine",
    description:
      "Video production services in Fort Worth, TX. Commercial, documentary, corporate video, and branded content.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

const services = [
  {
    title: "Commercial",
    description:
      "Broadcast and digital commercials for Fort Worth brands, agencies, and regional businesses. Full production from creative development to final delivery.",
  },
  {
    title: "Corporate",
    description:
      "Training content, leadership messaging, facility tours, and shareholder communications for Fort Worth manufacturers, defense contractors, and corporate campuses.",
  },
  {
    title: "Documentary",
    description:
      "Heritage storytelling, cultural preservation, and long-form brand documentaries. Fort Worth's history and character deserve production that matches.",
  },
  {
    title: "Short-Form",
    description:
      "Social-first content, event recaps, and digital ads optimized for reach. Built to perform across paid and organic channels.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We start with your goals, audience, and timeline. No assumptions, just a clear understanding of what you need.",
  },
  {
    number: "02",
    title: "Plan",
    description: "Scripts, storyboards, locations, and logistics. Every detail nailed down before production begins.",
  },
  {
    number: "03",
    title: "Produce",
    description: "Professional crews and cinema-grade equipment deployed with precision. Efficient operations, no wasted motion.",
  },
  {
    number: "04",
    title: "Deliver",
    description: "Full post-production, platform exports, and final assets. Ready to publish, broadcast, or distribute.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "Geared Like A Machine",
      url: "https://gearedlikeamachine.com/fort-worth-video-production",
      telephone: "(682) 229-7699",
      email: "hello@gearedlikeamachine.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fort Worth",
        addressRegion: "TX",
        addressCountry: "US",
      },
      areaServed: {
        "@type": "City",
        name: "Fort Worth",
      },
      priceRange: "$$",
    },
    {
      "@type": "Service",
      name: "Fort Worth Video Production",
      provider: {
        "@type": "LocalBusiness",
        name: "Geared Like A Machine",
      },
      serviceType: "Video Production",
      areaServed: {
        "@type": "City",
        name: "Fort Worth",
      },
      description:
        "Video production services in Fort Worth, TX. Commercial, documentary, corporate video, and branded content.",
    },
  ],
};

export default function FortWorthVideoProductionPage() {
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
                Fort Worth Video Production
              </h1>
              <div className="w-12 h-0.5 bg-steel my-4" />
              <p className="text-chrome text-base sm:text-lg leading-relaxed max-w-2xl">
                Production services built for Fort Worth and the western half of
                the DFW metroplex. Commercial, documentary, corporate, and branded
                content produced with the precision this city deserves.
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

        {/* Why GLM in Fort Worth */}
        <section className="py-20 sm:py-28 border-t border-card-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-wider uppercase text-white mb-8">
                Why GLM in Fort Worth
              </h2>
              <div className="space-y-6 text-chrome text-[15px] sm:text-base leading-relaxed">
                <p>
                  Fort Worth has always been its own city, and the production
                  needs here reflect that. Where Dallas leans corporate and tech-
                  driven, Fort Worth brings a different texture to the table:
                  manufacturing, aerospace, agriculture, energy, and a cultural
                  identity that runs deep. Producing video content in Fort Worth
                  means understanding these industries and the people behind
                  them. It means knowing that a recruitment film for an aerospace
                  contractor in the Naval Air Station Joint Reserve Base area
                  requires a fundamentally different approach than a brand spot
                  for a hospitality group in Sundance Square. We have worked
                  across these sectors and these neighborhoods. That experience
                  shapes every production decision we make, from scouting
                  locations to selecting the right crew for the job.
                </p>

                <p>
                  The Lockheed Martin facility in west Fort Worth is one of the
                  largest defense manufacturing plants in the world, and the
                  surrounding industrial corridor supports thousands of jobs in
                  advanced manufacturing, logistics, and supply chain operations.
                  Companies in this space produce video content for internal
                  training, safety compliance, recruitment, facility tours, and
                  government reporting. The requirements are specific:
                  controlled-access environments, security clearance
                  considerations, strict brand guidelines, and an expectation
                  that the production team operates with the same discipline as
                  the organizations being filmed. We bring that discipline. Our
                  operations run lean, our crews understand confidentiality
                  protocols, and our post-production pipeline is built to handle
                  review cycles that come with regulated industries. Fort Worth
                  manufacturing companies do not need a flashy production house.
                  They need a reliable one.
                </p>

                <p>
                  On the cultural side, Fort Worth offers a production landscape
                  that is genuinely distinct within the DFW metroplex. The
                  Stockyards National Historic District is one of the most
                  recognizable locations in Texas, drawing tourism year-round and
                  providing a visual identity that brands in western wear,
                  agriculture, food and beverage, and experiential hospitality
                  tap into regularly. The Cultural District, anchored by the
                  Kimbell Art Museum, the Modern Art Museum of Fort Worth, and
                  the Amon Carter Museum of American Art, is a world-class arts
                  corridor that supports documentary work, institutional content,
                  and event coverage. TCU and its surrounding community add
                  another layer, creating demand for athletics, alumni, and
                  education-focused content. Each of these areas carries its own
                  visual language and audience, and producing effective content in
                  each requires more than showing up with a camera. It requires
                  an understanding of the story each location tells and the
                  expectations of the organizations that operate there.
                </p>

                <p>
                  We are positioned in the DFW metroplex specifically because the
                  market demands it. Fort Worth production projects benefit from
                  our proximity. There are no travel charges, no unfamiliar
                  logistics, and no learning curve. When a Fort Worth brand needs
                  content, we are already in the area with equipment prepped,
                  crews on standby, and a clear understanding of what the city
                  looks like on camera at every time of day and in every season.
                  Our post-production capabilities, including editorial, color
                  grading, sound design, and motion graphics, mean that the
                  entire project stays under one roof from initial concept
                  through final delivery. Fort Worth is a city that values
                  substance over flash, and that is exactly how we approach every
                  production. The work speaks for itself.
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
                Start Your Fort Worth Project
              </h2>
              <p className="text-chrome text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Have a production coming up in Fort Worth? Tell us the details
                and we will put together a plan that fits your scope and timeline.
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
