"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}

export default function StatCard({ value, suffix, label, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      let current = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, value, delay]);

  return (
    <div
      ref={ref}
      className="dashboard-card flex flex-col items-center justify-center py-5 px-3"
      style={{ "--card-delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="font-[family-name:var(--font-heading)] text-3xl xl:text-4xl font-bold text-steel">
        {count}{suffix}
      </div>
      <p className="text-muted text-[10px] uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}
