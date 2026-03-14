"use client";

import { useState, useEffect, useRef } from "react";

type CatalogItem = {
  id: string;
  name: string;
  department: string;
  category: string;
  rateType: string;
  baseRate: number;
  markupPercent: number;
  billRate: number;
  isOwnerLabor: boolean;
};

const CATEGORY_FILTERS = ["All", "CREW", "GEAR", "POST", "PRE_PRO", "TRAVEL"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  CREW: "Crew",
  GEAR: "Gear",
  POST: "Post",
  PRE_PRO: "Pre-Pro",
  TRAVEL: "Travel",
};

interface EstimateSearchProps {
  onSelect: (item: CatalogItem) => void;
}

export default function EstimateSearch({ onSelect }: EstimateSearchProps) {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/estimates/catalog")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = catalog.filter((item) => {
    if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q)
    );
  });

  function handleSelect(item: CatalogItem) {
    onSelect(item);
    setQuery("");
    setShowDropdown(false);
  }

  function formatRate(rate: number, rateType: string) {
    if (rateType === "PER_MILE") return `$${(rate / 100).toFixed(2)}/mi`;
    const suffix = rateType === "HOUR" ? "/hr" : rateType === "DAY" ? "/day" : "";
    return `$${rate.toLocaleString()}${suffix}`;
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Category pills */}
      <div className="flex gap-1.5 mb-2">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded transition-colors ${
              categoryFilter === cat
                ? "bg-steel/20 text-white"
                : "text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {cat === "All" ? "All" : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
        >
          <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search catalog items..."
          className="w-full bg-card border border-card-border rounded px-9 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-steel/50"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (query.trim() || categoryFilter !== "All") && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-card border border-card-border rounded shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-xs text-muted text-center">No items found</div>
          ) : (
            filtered.slice(0, 20).map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs text-white truncate">
                    {item.isOwnerLabor && <span className="text-yellow-400 mr-1">&#9733;</span>}
                    {item.name}
                  </div>
                  <div className="text-[10px] text-muted truncate">{item.department}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-white font-mono">{formatRate(item.billRate, item.rateType)}</div>
                  {item.markupPercent > 0 && (
                    <div className="text-[9px] text-muted">
                      base ${item.baseRate.toLocaleString()} + {item.markupPercent}%
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
