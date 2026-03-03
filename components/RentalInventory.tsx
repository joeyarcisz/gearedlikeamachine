"use client";

import { useState } from "react";
import { inventory, categories } from "@/lib/inventory";

export default function RentalInventory() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = inventory.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      search === "" || item.item.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                <th className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-chrome font-semibold py-3 pr-4">
                  Item
                </th>
                <th className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-chrome font-semibold py-3 pr-4 hidden sm:table-cell">
                  Category
                </th>
                <th className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-chrome font-semibold py-3 text-right">
                  Day Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  className={`border-b border-card-border ${
                    i % 2 === 0 ? "bg-navy/30" : ""
                  }`}
                >
                  <td className="py-3 pr-4 text-sm text-white">{item.item}</td>
                  <td className="py-3 pr-4 text-sm text-muted hidden sm:table-cell">
                    {item.category}
                  </td>
                  <td className="py-3 text-sm text-steel text-right whitespace-nowrap">
                    ${item.rate.toLocaleString()} /day
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
    </section>
  );
}
