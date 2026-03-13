"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FieldSchema } from "@/lib/document-types";
import FormRenderer from "./FormRenderer";

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  requiresSignature: boolean;
  isExternal: boolean;
  fieldSchema: FieldSchema;
  defaultValues: Record<string, unknown> | null;
}

interface Project {
  id: string;
  title: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  LEGAL: "bg-purple-900/30 text-purple-300 border-purple-800/50",
  CREW: "bg-blue-900/30 text-blue-300 border-blue-800/50",
  PRODUCTION: "bg-yellow-900/30 text-yellow-300 border-yellow-800/50",
  FINANCIAL: "bg-green-900/30 text-green-300 border-green-800/50",
};

const CATEGORIES = ["All", "LEGAL", "CREW", "PRODUCTION", "FINANCIAL"] as const;

export default function DocumentCreator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTemplate = searchParams.get("template");

  const [step, setStep] = useState<"pick" | "fill">("pick");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [projectId, setProjectId] = useState("");
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successLink, setSuccessLink] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/documents/templates")
      .then((r) => r.json())
      .then((data) => {
        const tpls = Array.isArray(data) ? data : [];
        setTemplates(tpls);

        // Auto-select if template slug passed in URL
        if (preselectedTemplate) {
          const match = tpls.find(
            (t: Template) => t.slug === preselectedTemplate
          );
          if (match) {
            selectTemplate(match);
          }
        }
      });

    fetch("/api/production/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTemplate(template: Template) {
    setSelectedTemplate(template);
    setFormData(template.defaultValues || {});
    setErrors({});
    setStep("fill");
  }

  function goBack() {
    setStep("pick");
    setSelectedTemplate(null);
    setFormData({});
    setErrors({});
    setSuccessLink(null);
  }

  async function handleCreate() {
    if (!selectedTemplate) return;

    // Basic validation for required admin fields
    const newErrors: Record<string, string> = {};
    for (const section of selectedTemplate.fieldSchema.sections) {
      for (const field of section.fields) {
        if (field.required && field.prefilledByAdmin) {
          const val = formData[field.name];
          if (val === undefined || val === null || val === "") {
            newErrors[field.name] = "This field is required";
          }
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setCreating(true);

    try {
      // Create document
      const createRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          projectId: projectId || null,
          formData,
          recipientName: recipientName || null,
          recipientEmail: recipientEmail || null,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create document");
      }

      const doc = await createRes.json();

      // Set status to SENT
      await fetch(`/api/documents/${doc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SENT" }),
      });

      if (selectedTemplate.isExternal) {
        // Show success screen with link
        setSuccessLink(`${window.location.origin}/d/${doc.token}`);
      } else {
        router.push(`/admin/documents/${doc.id}`);
      }
    } catch (err) {
      setErrors({
        _form:
          err instanceof Error ? err.message : "Failed to create document",
      });
    } finally {
      setCreating(false);
    }
  }

  const filteredTemplates =
    categoryFilter === "All"
      ? templates
      : templates.filter((t) => t.category === categoryFilter);

  // Success screen
  if (successLink) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-green-300"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-steel uppercase tracking-wider mb-2">
          Document Created
        </h2>
        <p className="text-chrome text-sm mb-6">
          Share this link with the recipient to fill out and sign the document.
        </p>
        <div className="bg-card border border-card-border rounded-lg p-4 mb-4">
          <input
            type="text"
            readOnly
            value={successLink}
            className="w-full bg-black border border-card-border rounded px-3 py-2 text-steel text-sm text-center mb-3"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(successLink);
            }}
            className="w-full px-4 py-2 bg-steel text-black rounded text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
          >
            Copy Link
          </button>
        </div>
        <button
          onClick={() => router.push("/admin/documents")}
          className="text-chrome text-sm hover:text-steel"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  // Step 1: Pick template
  if (step === "pick") {
    return (
      <div>
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? "bg-steel text-black"
                  : "bg-card border border-card-border text-chrome hover:text-steel"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => selectTemplate(template)}
              className="text-left bg-card border border-card-border rounded-lg p-4 hover:border-steel/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${CATEGORY_COLORS[template.category] || "bg-zinc-700 text-zinc-300"}`}
                >
                  {template.category}
                </span>
                {template.isExternal && (
                  <span className="text-[10px] text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded">
                    External
                  </span>
                )}
                {template.requiresSignature && (
                  <span className="text-[10px] text-yellow-300 bg-yellow-900/20 px-1.5 py-0.5 rounded">
                    Signature
                  </span>
                )}
              </div>
              <h3 className="text-steel font-medium mb-1">{template.name}</h3>
              <p className="text-chrome text-xs line-clamp-2">
                {template.description}
              </p>
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-chrome text-sm">
              No templates found in this category.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Fill form
  return (
    <div>
      {/* Back button + template info */}
      <button
        onClick={goBack}
        className="flex items-center gap-1 text-chrome text-sm hover:text-steel mb-4"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to templates
      </button>

      {selectedTemplate && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${CATEGORY_COLORS[selectedTemplate.category] || "bg-zinc-700 text-zinc-300"}`}
              >
                {selectedTemplate.category}
              </span>
              <h2 className="font-heading text-xl font-bold text-steel">
                {selectedTemplate.name}
              </h2>
            </div>
            <p className="text-chrome text-sm">
              {selectedTemplate.description}
            </p>
          </div>

          {/* Document Settings */}
          <div className="bg-card border border-card-border rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-4">
              Document Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-steel font-medium mb-1.5 block">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-steel font-medium mb-1.5 block">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-steel font-medium mb-1.5 block">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel"
                >
                  <option value="">No project (standalone)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Admin Form Fields */}
          <FormRenderer
            fieldSchema={selectedTemplate.fieldSchema}
            formData={formData}
            onChange={setFormData}
            isAdmin={true}
            errors={errors}
          />

          {/* Error message */}
          {errors._form && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">{errors._form}</p>
            </div>
          )}

          {/* Create button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-6 py-2.5 bg-steel text-black rounded text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create Document"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
