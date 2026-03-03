"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface StartHereModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StartHereModal({ open, onClose }: StartHereModalProps) {
  const router = useRouter();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const options = [
    {
      title: "Discovery Form",
      description: "Tell us about your project and we'll follow up within 24 hours.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => {
        onClose();
        router.push("/discovery");
      },
    },
    {
      title: "Schedule a Call",
      description: "Book a time to talk through your project live.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => {
        // Placeholder — swap with Calendly link later
        window.open("#", "_self");
      },
    },
    {
      title: "Send an Email",
      description: "Drop us a line directly at hello@gearedlikeamachine.com.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => {
        window.location.href = "mailto:hello@gearedlikeamachine.com";
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-card-border p-6 sm:p-10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Heading */}
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-wide text-white mb-8 text-center">
          How do you want to get started?
        </h2>

        {/* Option cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {options.map((opt) => (
            <button
              key={opt.title}
              onClick={opt.onClick}
              className="group flex flex-col items-center text-center p-5 border border-card-border hover:border-steel bg-black/40 hover:bg-black/60 transition-all duration-200 cursor-pointer"
            >
              <div className="text-steel mb-3">{opt.icon}</div>
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-widest text-white mb-2">
                {opt.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
