"use client";

import { useState, useMemo } from "react";
import type { InventoryItem } from "@/lib/inventory";

interface EquipmentSelectorProps {
  inventory: InventoryItem[];
  categories: readonly string[];
  onSelect: (item: { itemName: string; category: string; dailyRate: number }) => void;
  onClose: () => void;
}

export default function EquipmentSelector({
  inventory,
  categories,
  onSelect,
  onClose,
}: EquipmentSelectorProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    let items = inventory;
    if (activeCategory !== "All") {
      items = items.filter((i) => i.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((i) => i.item.toLowerCase().includes(q));
    }
    return items;
  }, [inventory, activeCategory, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-card border border-card-border rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Select Equipment
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-card-border">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/60 border border-card-border text-white text-sm px-4 py-2 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
            autoFocus
          />
        </div>

        {/* Category tabs */}
        <div className="px-4 py-2 border-b border-card-border flex gap-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] whitespace-nowrap transition-colors rounded ${
              activeCategory === "All"
                ? "bg-steel text-black"
                : "text-muted hover:text-white"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] whitespace-nowrap transition-colors rounded ${
                activeCategory === cat
                  ? "bg-steel text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted text-sm">
              No equipment found
            </div>
          ) : (
            <div className="divide-y divide-card-border/50">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect({
                      itemName: item.item,
                      category: item.category,
                      dailyRate: item.rate,
                    });
                    onClose();
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{item.item}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      {item.category}
                    </div>
                  </div>
                  <div className="text-sm text-steel ml-4 shrink-0">
                    ${item.rate}/day
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
