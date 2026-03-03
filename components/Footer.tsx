import { siteConfig, navLinks, socialLinks } from "@/lib/data";
import { GearPlayLogo, socialIcons } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-card-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo + tagline */}
          <div>
            <h3 className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold tracking-[0.2em] uppercase mb-3">
              <GearPlayLogo className="w-7 h-7 text-steel" />
              Geared Like A Machine
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {siteConfig.tagline}. Cinema-grade video production based in{" "}
              {siteConfig.location}.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-card-border flex items-center justify-center text-muted text-xs hover:text-steel hover:border-steel transition-colors"
                  aria-label={link.label}
                >
                  {(() => {
                    const Icon = socialIcons[link.icon];
                    return Icon ? <Icon className="w-4 h-4" /> : link.icon;
                  })()}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-widest mb-4 text-chrome">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-widest mb-4 text-chrome">
              Contact
            </h4>
            <ul className="space-y-2 text-muted text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>{siteConfig.location}</li>
              <li className="text-steel">{siteConfig.availability}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-card-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-muted text-xs">
          <p>
            &copy; {new Date().getFullYear()} Geared Like A Machine. All rights
            reserved.
          </p>
          <p className="uppercase tracking-widest">
            Engineered in Dallas-Fort Worth
          </p>
        </div>
      </div>
    </footer>
  );
}
