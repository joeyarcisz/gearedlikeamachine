"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface DocTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  requiresSignature: boolean;
  isExternal: boolean;
}

interface DocProject {
  id: string;
  title: string;
}

interface DocumentRow {
  id: string;
  token: string;
  status: string;
  recipientName: string | null;
  recipientEmail: string | null;
  createdAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  template: DocTemplate;
  project: DocProject | null;
}

interface Stats {
  total: number;
  awaiting: number;
  completedToday: number;
  overdue: number;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-700 text-zinc-300",
  SENT: "bg-blue-900/50 text-blue-300",
  VIEWED: "bg-yellow-900/50 text-yellow-300",
  COMPLETED: "bg-green-900/50 text-green-300",
  EXPIRED: "bg-red-900/50 text-red-300",
  CANCELLED: "bg-zinc-700 text-zinc-300",
};

export default function DocumentDashboard() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    awaiting: 0,
    completedToday: 0,
    overdue: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();
      setDocuments(data.documents || []);
      setStats(
        data.stats || { total: 0, awaiting: 0, completedToday: 0, overdue: 0 }
      );
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/d/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  async function cancelDocument(id: string) {
    if (!confirm("Cancel this document? It will no longer be accessible."))
      return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocuments();
  }

  if (loading) {
    return (
      <div className="text-chrome text-sm py-12 text-center">
        Loading documents...
      </div>
    );
  }

  return (
    <div>
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-steel" },
          { label: "Awaiting", value: stats.awaiting, color: "text-blue-300" },
          {
            label: "Completed Today",
            value: stats.completedToday,
            color: "text-green-300",
          },
          { label: "Overdue", value: stats.overdue, color: "text-red-300" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-card-border rounded-lg p-4 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-chrome text-xs uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="VIEWED">Viewed</option>
          <option value="COMPLETED">Completed</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, template, or project..."
          className="flex-1 bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel"
        />
        <Link
          href="/admin/documents/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-steel text-black rounded text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
        >
          + New Document
        </Link>
      </div>

      {/* Table */}
      {documents.length === 0 ? (
        <div className="bg-card border border-card-border rounded-lg p-12 text-center">
          <p className="text-chrome text-sm">No documents found.</p>
          <Link
            href="/admin/documents/new"
            className="inline-block mt-3 text-steel text-sm hover:text-white"
          >
            Create your first document
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal">
                    Recipient
                  </th>
                  <th className="text-left px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal hidden sm:table-cell">
                    Created
                  </th>
                  <th className="text-right px-4 py-3 text-chrome text-xs uppercase tracking-wider font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-card-border/50 hover:bg-card-border/10"
                  >
                    <td className="px-4 py-3 text-steel">
                      {doc.template.name}
                    </td>
                    <td className="px-4 py-3 text-chrome">
                      {doc.recipientName || "---"}
                    </td>
                    <td className="px-4 py-3 text-chrome hidden md:table-cell">
                      {doc.project?.title || "---"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLORS[doc.status] || "bg-zinc-700 text-zinc-300"}`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-chrome text-xs hidden sm:table-cell">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/documents/${doc.id}`}
                          className="text-xs text-steel hover:text-white"
                        >
                          View
                        </Link>
                        {doc.template.isExternal &&
                          ["SENT", "VIEWED"].includes(doc.status) && (
                            <button
                              onClick={() => copyLink(doc.token)}
                              className="text-xs text-muted hover:text-steel"
                            >
                              {copied === doc.token ? "Copied!" : "Copy Link"}
                            </button>
                          )}
                        {["DRAFT", "SENT"].includes(doc.status) && (
                          <button
                            onClick={() => cancelDocument(doc.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
