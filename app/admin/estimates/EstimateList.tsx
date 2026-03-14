"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EstimateRow = {
  id: string;
  estimateNumber: string;
  title: string;
  status: string;
  total: number;
  updatedAt: string;
  contact: { id: string; name: string; company: string | null } | null;
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-chrome/20 text-chrome",
  SENT: "bg-blue-500/20 text-blue-400",
  ACCEPTED: "bg-green-500/20 text-green-400",
  DECLINED: "bg-red-500/20 text-red-400",
  EXPIRED: "bg-yellow-500/20 text-yellow-400",
};

const FILTER_TABS = ["All", "DRAFT", "SENT", "ACCEPTED"] as const;

export default function EstimateList() {
  const router = useRouter();
  const [estimates, setEstimates] = useState<EstimateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [duplicating, setDuplicating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/estimates")
      .then((r) => r.json())
      .then((data) => {
        setEstimates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "All"
      ? estimates
      : estimates.filter((e) => e.status === filter);

  const pipelineValue = estimates
    .filter((e) => e.status !== "DECLINED")
    .reduce((sum, e) => sum + e.total, 0);

  function formatCurrency(val: number) {
    return `$${val.toLocaleString("en-US")}`;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleDuplicate(e: React.MouseEvent, estId: string) {
    e.stopPropagation();
    setDuplicating(estId);
    try {
      const res = await fetch(`/api/estimates/${estId}/duplicate`, { method: "POST" });
      if (res.ok) {
        const refreshed = await fetch("/api/estimates").then((r) => r.json());
        setEstimates(refreshed);
      }
    } catch {
      // silent
    }
    setDuplicating(null);
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Estimates
          </h1>
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {estimates.length} total
          </span>
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            Pipeline: {formatCurrency(pipelineValue)}
          </span>
        </div>
        <Link
          href="/admin/estimates/new"
          className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
        >
          + New Estimate
        </Link>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded transition-colors ${
              filter === tab
                ? "bg-steel/20 text-white"
                : "text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {tab === "All" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            {tab !== "All" && (
              <span className="ml-1.5 text-chrome">
                {estimates.filter((e) => e.status === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted text-sm py-12 text-center">Loading estimates...</div>
      ) : filtered.length === 0 ? (
        <div className="text-muted text-sm py-12 text-center">
          {filter === "All" ? "No estimates yet. Create your first one." : `No ${filter.toLowerCase()} estimates.`}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-card-border text-[10px] uppercase tracking-widest text-muted">
                <th className="py-2 px-3 font-normal">Number</th>
                <th className="py-2 px-3 font-normal">Title / Client</th>
                <th className="py-2 px-3 font-normal text-right">Total</th>
                <th className="py-2 px-3 font-normal">Status</th>
                <th className="py-2 px-3 font-normal text-right">Date</th>
                <th className="py-2 px-1 w-8 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((est) => (
                <tr
                  key={est.id}
                  onClick={() => router.push(`/admin/estimates/${est.id}`)}
                  className="border-b border-card-border hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 text-xs text-chrome font-mono">
                    {est.estimateNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-xs text-white">{est.title}</div>
                    {est.contact && (
                      <div className="text-[10px] text-muted">
                        {est.contact.name}
                        {est.contact.company ? ` · ${est.contact.company}` : ""}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-xs text-white text-right font-mono">
                    {formatCurrency(est.total)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                        STATUS_COLORS[est.status] || "bg-card text-muted"
                      }`}
                    >
                      {est.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[10px] text-muted text-right">
                    {formatDate(est.updatedAt)}
                  </td>
                  <td className="py-3 px-1">
                    <button
                      onClick={(e) => handleDuplicate(e, est.id)}
                      disabled={duplicating === est.id}
                      title="Duplicate estimate"
                      className="text-muted hover:text-white transition-colors disabled:opacity-50 p-1"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                        <path d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m0 0a2.625 2.625 0 115.25 0H8.25z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
