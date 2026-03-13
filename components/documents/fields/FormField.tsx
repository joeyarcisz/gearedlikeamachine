"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  readOnly?: boolean;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  required,
  readOnly,
  helpText,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className={readOnly ? "opacity-60" : ""}>
      <div className="flex items-center gap-2 mb-1.5">
        <label className="text-sm text-steel font-medium">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {readOnly && (
          <span className="flex items-center gap-1 text-[10px] text-chrome bg-card-border/30 px-1.5 py-0.5 rounded">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Pre-filled
          </span>
        )}
      </div>
      {children}
      {helpText && !error && (
        <p className="text-chrome text-xs mt-1">{helpText}</p>
      )}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
