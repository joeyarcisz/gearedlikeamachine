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
      title: "Scope Engine",
      description: "Build your project scope and get an instant production estimate.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M9 7h6m-6 4h6m-3 4h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => {
        onClose();
        router.push("/scope");
      },
    },
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
      title: "Call Us Direct",
      description: "Talk through your project live, (682) 229-7699.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      onClick: () => {
        window.location.href = "tel:+16822297699";
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
        <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-wider text-white mb-8 text-center">
          How do you want to get started?
        </h2>

        {/* Option cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
