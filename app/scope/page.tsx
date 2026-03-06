import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScopePageContent from "@/components/scope/ScopePageContent";

export const metadata: Metadata = {
  title:
    "Production Scope Engine | Instant Video Production Estimate | Geared Like A Machine",
  description:
    "Get a ballpark video production estimate in under two minutes. Define your project type, crew, locations, and deliverables — the Scope Engine calculates your range instantly.",
  openGraph: {
    title: "Production Scope Engine — Geared Like A Machine",
    description:
      "Instant production estimates for commercials, brand films, and campaigns. Build your scope in under two minutes.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Production Scope Engine",
  applicationCategory: "BusinessApplication",
  description:
    "Get a ballpark video production estimate in under two minutes. Define your project type, crew, locations, and deliverables — the Scope Engine calculates your range instantly.",
  url: "https://www.gearedlikeamachine.com/scope",
  provider: {
    "@type": "Organization",
    name: "Geared Like A Machine",
    url: "https://www.gearedlikeamachine.com",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ScopePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20 bg-black min-h-screen">
        <ScopePageContent />
      </main>
      <Footer />
    </>
  );
}
