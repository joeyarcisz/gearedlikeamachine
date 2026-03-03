import type { Metadata } from "next";
import ScopeNavbar from "@/components/scope/ScopeNavbar";
import ScopeFooter from "@/components/scope/ScopeFooter";
import ScopeWizard from "@/components/scope/ScopeWizard";

export const metadata: Metadata = {
  title: "Scope & Instant Estimate | Geared Like A Machine",
  description:
    "Build your video production project scope and get an instant cost estimate. Free tool from Geared Like A Machine.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScopePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="no-print">
        <ScopeNavbar />
      </div>
      <main className="flex-1 pt-16 sm:pt-20">
        <ScopeWizard />
      </main>
      <div className="no-print">
        <ScopeFooter />
      </div>
    </div>
  );
}
