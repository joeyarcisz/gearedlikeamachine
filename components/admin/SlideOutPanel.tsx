"use client";

import { useEffect } from "react";

interface SlideOutPanelProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideOutPanel({
  open,
  onClose,
  children,
}: SlideOutPanelProps) {
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-[#0A0A0A]/80 transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[420px] h-full bg-[#1B1C1B] border-l border-card-border overflow-y-auto shadow-2xl animate-[slideIn_200ms_ease-out]">
        {children}
      </div>
    </div>
  );
}
