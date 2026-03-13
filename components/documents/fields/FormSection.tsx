"use client";

import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-chrome text-sm mb-3">{description}</p>
      )}
      <div className="border border-card-border rounded-lg p-4 sm:p-6 bg-card">
        {children}
      </div>
    </div>
  );
}
