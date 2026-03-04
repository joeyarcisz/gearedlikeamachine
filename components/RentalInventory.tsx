"use client";

import { useState, useMemo } from "react";
import { inventory, categories } from "@/lib/inventory";

export default function RentalInventory() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showQuote, setShowQuote] = useState(false);

  const filtered = inventory.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      search === "" || item.item.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredIds = useMemo(() => new Set(filtered.map((i) => i.id)), [filtered]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((i) => selectedIds.has(i.id));

  function toggleItem(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        for (const id of filteredIds) next.delete(id);
      } else {
        for (const id of filteredIds) next.add(id);
      }
      return next;
    });
  }

  const selectedItems = inventory.filter((i) => selectedIds.has(i.id));

  const groupedSelected = useMemo(() => {
    const groups: Record<string, typeof selectedItems> = {};
    for (const item of selectedItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [selectedItems]);

  const total = selectedItems.reduce((sum, i) => sum + i.rate, 0);

  function buildMailto() {
    const lines: string[] = ["Equipment Rental Inquiry", ""];
    for (const cat of Object.keys(groupedSelected).sort()) {
      lines.push(`── ${cat} ──`);
      for (const item of groupedSelected[cat]) {
        lines.push(`  ${item.item} — $${item.rate}/day`);
      }
      lines.push("");
    }
    lines.push(`Total: $${total}/day`);
    const subject = encodeURIComponent("Equipment Rental Inquiry");
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:hello@gearedlikeamachine.com?subject=${subject}&body=${body}`;
  }

  if (showQuote) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-8">
            Your Gear List
          </h2>

          {Object.keys(groupedSelected)
            .sort()
            .map((cat) => (
              <div key={cat} className="mb-6">
                <h3 className="text-xs uppercase tracking-widest text-chrome font-semibold font-[family-name:var(--font-heading)] mb-2">
                  {cat}
                </h3>
                <ul className="space-y-1">
                  {groupedSelected[cat].map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between text-sm py-1 border-b border-card-border"
                    >
                      <span className="text-white">{item.item}</span>
                      <span className="text-steel shrink-0 ml-4">
                        ${item.rate} /day
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div className="border-t border-steel pt-4 mt-8 flex justify-between items-center">
            <span className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
              Total: ${total} /day
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={() => {
                setSelectedIds(new Set());
                setShowQuote(false);
              }}
              className="px-6 py-3 text-xs uppercase tracking-widest font-semibold border border-card-border text-muted hover:text-white hover:border-steel/50 transition-colors duration-200"
            >
              Start Over
            </button>
            <a
              href={buildMailto()}
              className="inline-block text-center bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200"
            >
              Send This List
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-semibold border transition-colors duration-200 ${
                activeCategory === cat
                  ? "bg-steel text-black border-steel"
                  : "bg-navy/50 text-muted border-card-border hover:text-white hover:border-steel/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-navy/50 border border-card-border text-white placeholder:text-muted px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-steel/50 transition-colors"
          />
        </div>

        {/* Results count */}
        <p className="text-muted text-xs uppercase tracking-widest mb-4">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-card-border">
                <th className="py-3 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleAll}
                    className="accent-steel w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-chrome font-semibold py-3 pr-4">
                  Item
                </th>
                <th className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-chrome font-semibold py-3 pr-4 hidden sm:table-cell">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`border-b border-card-border cursor-pointer transition-colors duration-100 ${
                    selectedIds.has(item.id)
                      ? "bg-steel/10"
                      : i % 2 === 0
                        ? "bg-navy/30"
                        : ""
                  } hover:bg-steel/5`}
                >
                  <td className="py-3 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-steel w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4 text-sm text-white">{item.item}</td>
                  <td className="py-3 pr-4 text-sm text-muted hidden sm:table-cell">
                    {item.category}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-12 text-center text-muted text-sm"
                  >
                    No equipment found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky bottom bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-card-border bg-navy/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-white">
              <span className="font-semibold">{selectedIds.size}</span>{" "}
              {selectedIds.size === 1 ? "item" : "items"} selected
            </span>
            <button
              onClick={() => setShowQuote(true)}
              className="bg-steel text-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200"
            >
              Build Quote
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
