"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { FieldSchema } from "@/lib/document-types";

interface Signature {
  id: string;
  signerName: string;
  signerIP: string;
  userAgent: string;
  signedAt: string;
}

interface CrewInvoice {
  id: string;
  status: string;
  paymentMethod: string | null;
  paidAt: string | null;
  paidNote: string | null;
  crewMember: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string | null;
  };
}

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  requiresSignature: boolean;
  isExternal: boolean;
  fieldSchema: FieldSchema;
}

interface Project {
  id: string;
  title: string;
}

interface DocumentData {
  id: string;
  token: string;
  status: string;
  formData: Record<string, unknown>;
  recipientName: string | null;
  recipientEmail: string | null;
  createdAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  template: Template;
  project: Project | null;
  signature: Signature | null;
  crewInvoice: CrewInvoice | null;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-700 text-zinc-300",
  SENT: "bg-blue-900/50 text-blue-300",
  VIEWED: "bg-yellow-900/50 text-yellow-300",
  COMPLETED: "bg-green-900/50 text-green-300",
  EXPIRED: "bg-red-900/50 text-red-300",
  CANCELLED: "bg-zinc-700 text-zinc-300",
};

const INVOICE_STATUS_COLORS: Record<string, string> = {
  SENT: "bg-blue-900/50 text-blue-300",
  RETURNED: "bg-yellow-900/50 text-yellow-300",
  PAID: "bg-green-900/50 text-green-300",
};

export default function DocumentDetail({ id }: { id: string }) {
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDoc(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function copyLink() {
    if (!doc) return;
    navigator.clipboard.writeText(`${window.location.origin}/d/${doc.token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleMarkPaid() {
    if (!doc?.crewInvoice) return;
    const note = prompt("Payment note (optional):");
    setMarkingPaid(true);
    try {
      await fetch(`/api/crew-invoices/${doc.crewInvoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID", paidNote: note || null }),
      });
      // Refresh document
      const res = await fetch(`/api/documents/${id}`);
      const data = await res.json();
      setDoc(data);
    } catch {
      // silently fail
    } finally {
      setMarkingPaid(false);
    }
  }

  function formatFieldValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "---";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") {
      // Try parsing as address JSON
      try {
        const parsed = JSON.parse(value);
        if (parsed.street && parsed.city) {
          return `${parsed.street}, ${parsed.city}, ${parsed.state} ${parsed.zip}`;
        }
      } catch {
        // not JSON
      }
      // Check for date range
      if (value.includes("|")) {
        const [start, end] = value.split("|");
        if (start && end) return `${start} to ${end}`;
      }
    }
    return String(value);
  }

  if (loading) {
    return (
      <div className="text-chrome text-sm py-12 text-center">
        Loading document...
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-12">
        <p className="text-chrome text-sm">Document not found.</p>
        <Link
          href="/admin/documents"
          className="text-steel text-sm hover:text-white mt-2 inline-block"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-heading text-xl font-bold text-steel">
              {doc.template.name}
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_COLORS[doc.status] || "bg-zinc-700 text-zinc-300"}`}
            >
              {doc.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-chrome">
            {doc.project && (
              <Link
                href={`/admin/production/${doc.project.id}`}
                className="hover:text-steel"
              >
                {doc.project.title}
              </Link>
            )}
            {doc.recipientName && (
              <span>
                {doc.recipientName}
                {doc.recipientEmail && (
                  <span className="text-muted ml-1">
                    ({doc.recipientEmail})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {doc.template.isExternal &&
            ["SENT", "VIEWED"].includes(doc.status) && (
              <button
                onClick={copyLink}
                className="px-3 py-1.5 bg-card border border-card-border rounded text-xs text-steel hover:border-steel transition-colors"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
            )}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-card border border-card-border rounded text-xs text-steel hover:border-steel transition-colors"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Crew Invoice Status Card */}
      {doc.crewInvoice && (
        <div className="bg-card border border-card-border rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-3">
            Crew Invoice
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-1">
                Crew Member
              </p>
              <p className="text-steel text-sm">
                {doc.crewInvoice.crewMember.name}
                {doc.crewInvoice.crewMember.role && (
                  <span className="text-muted ml-1">
                    ({doc.crewInvoice.crewMember.role})
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-1">
                Invoice Status
              </p>
              <div className="flex items-center gap-2">
                {["SENT", "RETURNED", "PAID"].map((s) => (
                  <span
                    key={s}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      doc.crewInvoice!.status === s
                        ? INVOICE_STATUS_COLORS[s]
                        : "bg-card-border/30 text-muted"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {doc.crewInvoice.paidAt && (
              <div>
                <p className="text-chrome text-xs uppercase tracking-wider mb-1">
                  Paid
                </p>
                <p className="text-green-300 text-sm">
                  {new Date(doc.crewInvoice.paidAt).toLocaleDateString()}
                </p>
              </div>
            )}
            {doc.crewInvoice.status === "RETURNED" && (
              <button
                onClick={handleMarkPaid}
                disabled={markingPaid}
                className="ml-auto px-4 py-2 bg-green-900/30 border border-green-800 rounded text-sm text-green-300 hover:bg-green-900/50 transition-colors disabled:opacity-50"
              >
                {markingPaid ? "Updating..." : "Mark Paid"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form Data by Sections */}
      {doc.template.fieldSchema.sections.map((section, sectionIdx) => {
        const fieldsWithValues = section.fields.filter(
          (f) =>
            doc.formData[f.name] !== undefined &&
            doc.formData[f.name] !== null &&
            doc.formData[f.name] !== ""
        );

        if (fieldsWithValues.length === 0) return null;

        return (
          <div
            key={sectionIdx}
            className="bg-card border border-card-border rounded-lg p-4 sm:p-6 mb-4"
          >
            <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-4">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {fieldsWithValues.map((field) => (
                <div key={field.name}>
                  <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                    {field.label}
                  </p>
                  <p className="text-steel text-sm">
                    {formatFieldValue(doc.formData[field.name])}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Signature Details */}
      {doc.signature && (
        <div className="bg-card border border-card-border rounded-lg p-4 sm:p-6 mb-4">
          <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-4">
            Signature
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                Signer Name
              </p>
              <p className="text-steel text-sm">{doc.signature.signerName}</p>
            </div>
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                Signed Date
              </p>
              <p className="text-steel text-sm">
                {new Date(doc.signature.signedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                IP Address
              </p>
              <p className="text-steel text-sm font-mono">
                {doc.signature.signerIP}
              </p>
            </div>
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                User Agent
              </p>
              <p className="text-steel text-sm font-mono text-xs break-all">
                {doc.signature.userAgent}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="bg-card border border-card-border rounded-lg p-4 sm:p-6">
        <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-4">
          Document Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
              Document ID
            </p>
            <p className="text-steel text-sm font-mono">{doc.id}</p>
          </div>
          <div>
            <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
              Created
            </p>
            <p className="text-steel text-sm">
              {new Date(doc.createdAt).toLocaleString()}
            </p>
          </div>
          {doc.completedAt && (
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                Completed
              </p>
              <p className="text-steel text-sm">
                {new Date(doc.completedAt).toLocaleString()}
              </p>
            </div>
          )}
          {doc.expiresAt && (
            <div>
              <p className="text-chrome text-xs uppercase tracking-wider mb-0.5">
                Expires
              </p>
              <p className="text-steel text-sm">
                {new Date(doc.expiresAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
