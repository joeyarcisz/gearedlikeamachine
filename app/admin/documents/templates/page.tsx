"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { FieldSchema } from "@/lib/document-types";

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

const CATEGORY_COLORS: Record<string, string> = {
  LEGAL: "bg-purple-900/30 text-purple-300",
  CREW: "bg-blue-900/30 text-blue-300",
  PRODUCTION: "bg-yellow-900/30 text-yellow-300",
  FINANCIAL: "bg-green-900/30 text-green-300",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/documents/templates")
      .then((r) => r.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider">
          Document Templates
        </h1>
        <p className="text-chrome text-sm mt-1">
          {templates.length} templates available
        </p>
      </div>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="bg-card border border-card-border rounded-lg">
            <button
              onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              className="w-full text-left p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${CATEGORY_COLORS[t.category]}`}>
                  {t.category}
                </span>
                <span className="text-steel font-medium">{t.name}</span>
                {t.isExternal && <span className="text-[10px] text-blue-300">External</span>}
                {t.requiresSignature && <span className="text-[10px] text-yellow-300">Signature</span>}
              </div>
              <span className="text-chrome">{expanded === t.id ? "−" : "+"}</span>
            </button>
            {expanded === t.id && (
              <div className="border-t border-card-border p-4">
                <p className="text-sm text-chrome mb-3">{t.description}</p>
                {t.fieldSchema.sections.map((section, idx) => (
                  <div key={idx} className="mb-3">
                    <h4 className="text-xs text-steel uppercase tracking-wider mb-1">{section.title}</h4>
                    <div className="text-xs text-chrome space-y-0.5">
                      {section.fields.map((f) => (
                        <div key={f.name} className="flex gap-2">
                          <span className="text-muted w-32 flex-shrink-0">{f.type}</span>
                          <span>{f.label}</span>
                          {f.required && <span className="text-red-400">*</span>}
                          {f.prefilledByAdmin && <span className="text-yellow-300">(admin)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href={`/admin/documents/new?template=${t.slug}`}
                  className="inline-block mt-2 px-3 py-1.5 bg-steel text-black rounded text-xs font-bold uppercase hover:bg-white transition-colors"
                >
                  Create from this template
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
