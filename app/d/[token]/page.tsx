"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import FormRenderer from "@/components/documents/FormRenderer";
import type { PublicDocumentData } from "@/lib/document-types";

type PageState =
  | "loading"
  | "form"
  | "submitting"
  | "completed"
  | "expired"
  | "cancelled"
  | "not_found"
  | "error";

export default function PublicDocumentPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [state, setState] = useState<PageState>("loading");
  const [doc, setDoc] = useState<PublicDocumentData | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [signature, setSignature] = useState({ signerName: "", agreed: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const markedViewed = useRef(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/d/${token}`)
      .then((r) => {
        if (r.status === 404) {
          setState("not_found");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.status === "COMPLETED") {
          setState("completed");
          return;
        }
        if (data.status === "EXPIRED") {
          setState("expired");
          return;
        }
        if (data.status === "CANCELLED") {
          setState("cancelled");
          return;
        }
        if (data.error) {
          setErrorMessage(data.error);
          setState("error");
          return;
        }

        setDoc(data);
        setFormData(data.formData || {});
        setState("form");
      })
      .catch(() => {
        setErrorMessage("Unable to load document. Please try again.");
        setState("error");
      });
  }, [token]);

  // Mark as viewed on first interaction
  useEffect(() => {
    if (state !== "form" || markedViewed.current) return;

    const markViewed = () => {
      if (markedViewed.current) return;
      markedViewed.current = true;
      fetch(`/api/d/${token}`, { method: "PATCH" }).catch(() => {});
    };

    window.addEventListener("click", markViewed, { once: true });
    window.addEventListener("keydown", markViewed, { once: true });
    window.addEventListener("scroll", markViewed, { once: true });

    return () => {
      window.removeEventListener("click", markViewed);
      window.removeEventListener("keydown", markViewed);
      window.removeEventListener("scroll", markViewed);
    };
  }, [state, token]);

  async function handleSubmit() {
    if (!doc) return;

    // Validate required fields the signer needs to fill
    const newErrors: Record<string, string> = {};
    for (const section of doc.fieldSchema.sections) {
      for (const field of section.fields) {
        if (field.required && !field.prefilledByAdmin) {
          const val = formData[field.name];
          if (val === undefined || val === null || val === "") {
            newErrors[field.name] = "This field is required";
          }
        }
      }
    }

    // Validate signature if required
    if (doc.requiresSignature) {
      if (!signature.signerName.trim()) {
        newErrors.signature = "Please type your full name";
      } else if (!signature.agreed) {
        newErrors.signature = "Please check the agreement box";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setState("submitting");

    try {
      const body: Record<string, unknown> = { formData };

      if (doc.requiresSignature) {
        body.signature = signature;
      }

      // If crew invoice, extract payment method from form data
      if (formData.preferredPayment) {
        body.paymentMethod = formData.preferredPayment;
        body.paymentDetails = {
          handle: formData.paymentHandle,
          notes: formData.paymentNotes,
        };
      }

      const res = await fetch(`/api/d/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      router.push(`/d/${token}/complete`);
    } catch (err) {
      setState("form");
      setErrors({
        _form:
          err instanceof Error ? err.message : "Failed to submit document",
      });
    }
  }

  // Loading
  if (state === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-chrome text-sm animate-pulse">
          Loading document...
        </div>
      </div>
    );
  }

  // Already completed
  if (state === "completed") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-900/30 border border-green-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
            Already Submitted
          </h1>
          <p className="text-chrome">
            This document has already been submitted. If you need to make
            changes, please contact GLM directly.
          </p>
        </div>
      </div>
    );
  }

  // Expired
  if (state === "expired") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
            Document Expired
          </h1>
          <p className="text-chrome">
            This document link has expired. Please contact GLM to request a new
            link.
          </p>
        </div>
      </div>
    );
  }

  // Cancelled
  if (state === "cancelled") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
            Document Cancelled
          </h1>
          <p className="text-chrome">
            This document has been cancelled. Please contact GLM if you believe
            this is an error.
          </p>
        </div>
      </div>
    );
  }

  // Not found
  if (state === "not_found") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
            Not Found
          </h1>
          <p className="text-chrome">
            This document could not be found. Please check the link and try
            again.
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (state === "error") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-2xl font-bold text-steel uppercase tracking-wider mb-3">
            Something Went Wrong
          </h1>
          <p className="text-chrome">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Form
  if (!doc) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-card-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-heading text-xs font-bold text-chrome uppercase tracking-widest">
              GLM
            </span>
            {doc.projectName && (
              <span className="text-xs text-muted">{doc.projectName}</span>
            )}
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-steel uppercase tracking-wider">
            {doc.templateName}
          </h1>
          {doc.recipientName && (
            <p className="text-chrome text-sm mt-1">
              Prepared for {doc.recipientName}
            </p>
          )}
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {errors._form && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 mb-6">
            <p className="text-red-300 text-sm">{errors._form}</p>
          </div>
        )}

        <FormRenderer
          fieldSchema={doc.fieldSchema}
          formData={formData}
          onChange={setFormData}
          isAdmin={false}
          requiresSignature={doc.requiresSignature}
          signatureData={signature}
          onSignatureChange={setSignature}
          errors={errors}
        />

        {/* Submit */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={state === "submitting"}
            className="w-full sm:w-auto px-8 py-3 bg-steel text-black rounded text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === "submitting" ? "Submitting..." : "Submit Document"}
          </button>
        </div>

        <p className="text-center text-muted text-xs mt-4">
          By submitting, you confirm that all information provided is accurate.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-card-border mt-12">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6">
          <p className="text-center text-muted text-xs font-heading uppercase tracking-widest">
            Powered by GLM
          </p>
        </div>
      </div>
    </div>
  );
}
