"use client";

import { useState, useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onDone: () => void;
}

export default function Toast({ message, duration = 1500, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), duration);
    const removeTimer = setTimeout(() => onDoneRef.current(), duration + 300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] px-4 py-2 bg-[#303030] border border-card-border text-[#E0E0E0] text-sm rounded transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
