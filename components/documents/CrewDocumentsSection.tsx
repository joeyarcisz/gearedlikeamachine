"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CrewDoc {
  id: string;
  token: string;
  status: string;
  recipientName: string | null;
  createdAt: string;
  completedAt: string | null;
  template: { name: string; isExternal: boolean };
  project: { title: string } | null;
  crewInvoice: {
    id: string;
    status: string;
    paymentMethod: string | null;
    paidAt: string | null;
  } | null;
}

export default function CrewDocumentsSection({
  crewMemberId,
  crewMemberName,
}: {
  crewMemberId: string;
  crewMemberName: string;
}) {
  const [documents, setDocuments] = useState<CrewDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/documents?search=${encodeURIComponent(crewMemberName)}`)
      .then((r) => r.json())
      .then((data) => {
        setDocuments(data.documents || []);
        setLoading(false);
      });
  }, [crewMemberName]);

  const invoices = documents.filter((d) => d.crewInvoice);
  const otherDocs = documents.filter((d) => !d.crewInvoice);

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/d/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  async function markPaid(invoiceId: string) {
    const note = prompt("Payment note (optional):");
    await fetch(`/api/crew-invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAID", paidNote: note || null }),
    });
    // Refresh
    const res = await fetch(`/api/documents?search=${encodeURIComponent(crewMemberName)}`);
    const data = await res.json();
    setDocuments(data.documents || []);
  }

  if (loading) return null;

  return (
    <>
      {/* Invoices */}
      {invoices.length > 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Invoices
            </h2>
          </div>
          <div className="dashboard-card-body space-y-2">
            {invoices.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-card-border/50">
                <div>
                  <Link href={`/admin/documents/${doc.id}`} className="text-sm text-white hover:text-steel">
                    Crew Invoice
                  </Link>
                  {doc.project && <span className="text-muted text-xs ml-2">{doc.project.title}</span>}
                  <p className="text-muted text-[10px] mt-0.5">
                    {new Date(doc.createdAt).toLocaleDateString()}
                    {doc.crewInvoice?.paymentMethod && ` · ${doc.crewInvoice.paymentMethod}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    doc.crewInvoice?.status === "PAID" ? "bg-green-900/50 text-green-300" :
                    doc.crewInvoice?.status === "RETURNED" ? "bg-yellow-900/50 text-yellow-300" :
                    "bg-blue-900/50 text-blue-300"
                  }`}>
                    {doc.crewInvoice?.status}
                  </span>
                  {doc.crewInvoice?.status === "RETURNED" && (
                    <button
                      onClick={() => markPaid(doc.crewInvoice!.id)}
                      className="text-[10px] text-green-300 hover:text-green-200"
                    >
                      Mark Paid
                    </button>
                  )}
                  {doc.crewInvoice?.status === "SENT" && (
                    <button onClick={() => copyLink(doc.token)} className="text-[10px] text-muted hover:text-steel">
                      {copied === doc.token ? "Copied!" : "Copy Link"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other documents */}
      {otherDocs.length > 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Documents
            </h2>
          </div>
          <div className="dashboard-card-body space-y-2">
            {otherDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-card-border/50">
                <div>
                  <Link href={`/admin/documents/${doc.id}`} className="text-sm text-white hover:text-steel">
                    {doc.template.name}
                  </Link>
                  {doc.project && <span className="text-muted text-xs ml-2">{doc.project.title}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    doc.status === "COMPLETED" ? "bg-green-900/50 text-green-300" :
                    doc.status === "SENT" ? "bg-blue-900/50 text-blue-300" :
                    "bg-zinc-700 text-zinc-300"
                  }`}>
                    {doc.status}
                  </span>
                  {doc.template.isExternal && ["SENT", "VIEWED"].includes(doc.status) && (
                    <button onClick={() => copyLink(doc.token)} className="text-[10px] text-muted hover:text-steel">
                      {copied === doc.token ? "Copied!" : "Copy Link"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
