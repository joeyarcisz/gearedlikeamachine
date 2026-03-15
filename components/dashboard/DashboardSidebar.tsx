"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavLinks, siteConfig, socialLinks } from "@/lib/data";
import { GearPlayLogo, navIcons, socialIcons } from "@/components/icons";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleNavClick = (target: string) => {
    onClose();
    if (target.startsWith("/")) return; // Let Link handle routing
    // Scroll to section on homepage
    if (pathname !== "/") {
      window.location.assign("/" + target);
      return;
    }
    const el = document.querySelector(target);
    if (el) {
      const main = document.querySelector(".dashboard-main");
      if (main) {
        const rect = el.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        main.scrollTo({ top: main.scrollTop + rect.top - mainRect.top, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-card-border">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <GearPlayLogo className="w-8 h-8 text-steel shrink-0" />
            <span className="font-[family-name:var(--font-heading)] text-[11px] font-bold tracking-[0.12em] uppercase text-white sidebar-label leading-tight">
              Geared Like<br />A Machine
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {dashboardNavLinks.map((link) => {
            const Icon = navIcons[link.icon];
            const isRoute = link.target.startsWith("/");
            const isActive = isRoute
              ? pathname === link.target
              : pathname === "/" && link.target === "#top";

            const className = `flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200 rounded ${
              isActive
                ? "text-steel bg-steel/10"
                : "text-muted hover:text-white hover:bg-white/5"
            }`;

            if (isRoute) {
              return (
                <Link
                  key={link.label}
                  href={link.target}
                  className={className}
                  onClick={onClose}
                >
                  {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
                  <span className="sidebar-label font-[family-name:var(--font-heading)]">
                    {link.label}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.target)}
                className={`${className} w-full text-left`}
              >
                {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
                <span className="sidebar-label font-[family-name:var(--font-heading)]">
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section: contact + socials + CTA */}
        <div className="mt-auto border-t border-card-border px-4 py-4 space-y-4">
          {/* Contact info */}
          <div className="sidebar-label space-y-1">
            <p className="text-muted text-[10px] uppercase tracking-widest">Contact</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-chrome text-xs hover:text-steel transition-colors block truncate"
            >
              {siteConfig.email}
            </a>
            <p className="text-chrome text-xs">{siteConfig.phone}</p>
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            {socialLinks.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-steel transition-colors"
                  aria-label={s.label}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </a>
              );
            })}
          </div>

          {/* CTA Button */}
          <a
            href={`mailto:${siteConfig.email}`}
            className="sidebar-label block text-center bg-steel text-black px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
          >
            Start Project
          </a>
        </div>
      </aside>
    </>
  );
}
