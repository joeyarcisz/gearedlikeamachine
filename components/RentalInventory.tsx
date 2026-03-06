"use client";

import { useState, useMemo } from "react";
import { inventory, categories } from "@/lib/inventory";

function getRentalDays(pickup: string, returnDate: string): number {
  if (!pickup || !returnDate) return 1;
  const start = new Date(pickup + "T00:00:00");
  const end = new Date(returnDate + "T00:00:00");
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RentalInventory() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showQuote, setShowQuote] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(categories)
  );
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const rentalDays = getRentalDays(pickupDate, returnDate);

  const filtered = inventory.filter(
    (item) =>
      search === "" || item.item.toLowerCase().includes(search.toLowerCase())
  );

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filtered]);

  function toggleCategory(cat: string) {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleItem(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategoryItems(cat: string) {
    const catItems = groupedFiltered[cat] || [];
    const allSelected = catItems.every((i) => selectedIds.has(i.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const item of catItems) {
        if (allSelected) next.delete(item.id);
        else next.add(item.id);
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

  const grandTotal = total * rentalDays;

  function buildMailto() {
    const lines: string[] = ["Equipment Rental Inquiry", ""];
    if (pickupDate && returnDate) {
      lines.push(`Pickup: ${formatDate(pickupDate)}`);
      lines.push(`Return: ${formatDate(returnDate)}`);
      lines.push(`Duration: ${rentalDays} day${rentalDays !== 1 ? "s" : ""}`);
      lines.push("");
    }
    for (const cat of Object.keys(groupedSelected).sort()) {
      lines.push(`── ${cat} ──`);
      for (const item of groupedSelected[cat]) {
        lines.push(`  ${item.item} — $${item.rate}/day`);
      }
      lines.push("");
    }
    lines.push(`Daily Rate: $${total}/day`);
    if (rentalDays > 1) {
      lines.push(`${rentalDays} Days Total: $${grandTotal}`);
    }
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

          <div className="border-t border-steel pt-4 mt-8 space-y-2">
            {pickupDate && returnDate && (
              <div className="flex justify-between text-sm text-muted">
                <span>{formatDate(pickupDate)} &rarr; {formatDate(returnDate)}</span>
                <span>{rentalDays} day{rentalDays !== 1 ? "s" : ""}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
                {rentalDays > 1 ? (
                  <>
                    ${total}/day &times; {rentalDays} days = ${grandTotal}
                  </>
                ) : (
                  <>Total: ${total} /day</>
                )}
              </span>
            </div>
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

  const displayCategories = search
    ? Object.keys(groupedFiltered).sort()
    : [...categories].sort();

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Search + Date pickers */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-navy/50 border border-card-border text-white placeholder:text-muted px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-steel/50 transition-colors"
          />
          <div className="flex gap-3">
            <div>
              <label className="block text-muted text-[10px] uppercase tracking-widest mb-1">
                Pickup
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-navy/50 border border-card-border text-white px-3 py-2.5 text-sm focus:outline-none focus:border-steel/50 transition-colors [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-muted text-[10px] uppercase tracking-widest mb-1">
                Return
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || new Date().toISOString().split("T")[0]}
                className="bg-navy/50 border border-card-border text-white px-3 py-2.5 text-sm focus:outline-none focus:border-steel/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-muted text-xs uppercase tracking-widest mb-6">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </p>

        {/* Collapsible category sections */}
        <div className="space-y-[1px]">
          {displayCategories.map((cat) => {
            const items = groupedFiltered[cat] || [];
            if (items.length === 0) return null;
            const isCollapsed = collapsedCategories.has(cat);
            const selectedCount = items.filter((i) =>
              selectedIds.has(i.id)
            ).length;
            const allSelected =
              items.length > 0 && items.every((i) => selectedIds.has(i.id));

            return (
              <div key={cat} className="border border-card-border">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-navy/50 hover:bg-navy/80 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-muted text-xs transition-transform duration-200 ${
                        isCollapsed ? "" : "rotate-90"
                      }`}
                    >
                      &#9654;
                    </span>
                    <span className="font-[family-name:var(--font-heading)] text-sm uppercase tracking-widest text-white font-semibold">
                      {cat}
                    </span>
                    <span className="text-muted text-xs">
                      {items.length}{" "}
                      {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedCount > 0 && (
                      <span className="text-steel text-xs font-semibold">
                        {selectedCount} selected
                      </span>
                    )}
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleCategoryItems(cat);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-steel w-4 h-4 cursor-pointer"
                    />
                  </div>
                </button>

                {/* Category items */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isCollapsed ? "max-h-0" : "max-h-[2000px]"
                  }`}
                >
                  <table className="w-full text-left">
                    <tbody>
                      {items.map((item, i) => (
                        <tr
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`border-t border-card-border cursor-pointer transition-colors duration-100 ${
                            selectedIds.has(item.id)
                              ? "bg-steel/10"
                              : i % 2 === 0
                                ? "bg-navy/30"
                                : ""
                          } hover:bg-steel/5`}
                        >
                          <td className="py-3 pl-10 pr-2 w-10">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(item.id)}
                              onChange={() => toggleItem(item.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="accent-steel w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 pr-4 text-sm text-white">
                            {item.item}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-12 text-center text-muted text-sm">
              No equipment found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-card-border bg-navy/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-white">
              <span className="font-semibold">{selectedIds.size}</span>{" "}
              {selectedIds.size === 1 ? "item" : "items"} selected
              {rentalDays > 1 && (
                <span className="text-steel ml-3">
                  {rentalDays} days &middot; ${grandTotal}
                </span>
              )}
            </div>
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
