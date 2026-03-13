import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Geared Like A Machine",
  description: "Privacy policy for Geared Like A Machine LLC.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-12 sm:pt-16 mb-10">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Legal
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted text-sm uppercase tracking-widest">
              Last updated: March 12, 2026
            </p>
          </div>

          <div className="border-t border-card-border mb-10" />

          <div className="space-y-8 text-[15px] leading-relaxed text-steel/90">
            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Who We Are
              </h2>
              <p>
                Geared Like A Machine LLC (&quot;GLM,&quot; &quot;we,&quot; &quot;us&quot;) is a
                video production and equipment rental company based in Texas. This policy
                explains how we collect, use, and protect your information when you use our
                website at gearedlikeamachine.com and related services.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Information We Collect
              </h2>
              <p className="mb-3">We collect information you provide directly:</p>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>Name and email address when you subscribe to our blog</li>
                <li>Name, email, company, phone, and project details when you submit a discovery form or contact us</li>
                <li>Email address when you request a rental quote or project estimate</li>
              </ul>
              <p className="mt-3">
                We do not collect personal information automatically beyond standard server
                logs (IP address, browser type, pages visited) provided by our hosting
                platform, Vercel.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>To respond to inquiries and provide requested services</li>
                <li>To send blog post notifications if you subscribe</li>
                <li>To manage client relationships and project communications</li>
                <li>To publish content to our social media accounts (Instagram, LinkedIn, X/Twitter) via authorized API integrations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Third-Party Services
              </h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-1 text-muted mt-2">
                <li><strong className="text-white">Vercel</strong> for website hosting</li>
                <li><strong className="text-white">Neon</strong> for database hosting</li>
                <li><strong className="text-white">Resend</strong> for sending email notifications</li>
                <li><strong className="text-white">Meta/Instagram API</strong> for publishing content to our Instagram account</li>
              </ul>
              <p className="mt-3">
                We do not sell, trade, or share your personal information with third parties
                for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Instagram API Usage
              </h2>
              <p>
                Our application uses the Instagram Graph API solely to publish content
                (photos and captions) to the official Geared Like A Machine Instagram
                account. We do not access, store, or process any Instagram user data beyond
                our own business account. No third-party Instagram accounts are accessed
                through this integration.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Data Retention
              </h2>
              <p>
                Contact information is retained as long as necessary for business
                relationship management. Blog subscriber emails are retained until you
                unsubscribe. You may request deletion of your data at any time by contacting
                us.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Data Security
              </h2>
              <p>
                We use industry-standard security measures including encrypted connections
                (HTTPS), secure database hosting, and hashed authentication credentials. No
                method of transmission over the internet is 100% secure, but we take
                reasonable steps to protect your information.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Your Rights
              </h2>
              <p>You may:</p>
              <ul className="list-disc list-inside space-y-1 text-muted mt-2">
                <li>Request access to the personal data we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Unsubscribe from blog notifications at any time</li>
                <li>Opt out of any future communications</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Contact
              </h2>
              <p>
                For privacy-related questions or data requests, contact us at{" "}
                <a
                  href="mailto:hello@gearedlikeamachine.com"
                  className="text-white underline hover:text-steel transition-colors"
                >
                  hello@gearedlikeamachine.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-white mb-3">
                Changes
              </h2>
              <p>
                We may update this policy from time to time. Changes will be posted on this
                page with an updated revision date.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
