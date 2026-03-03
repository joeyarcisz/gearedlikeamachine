import Link from "next/link";
import { GearPlayLogo } from "@/components/icons";

export default function ScopeNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold tracking-[0.2em] uppercase text-white"
          >
            <GearPlayLogo className="w-8 h-8 sm:w-9 sm:h-9 text-steel" />
            GEARED LIKE A MACHINE
          </Link>
          <Link
            href="/"
            className="text-sm uppercase tracking-widest text-muted hover:text-white transition-colors duration-200"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </nav>
  );
}
