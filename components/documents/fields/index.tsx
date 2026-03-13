"use client";

import React from "react";
import FormField from "./FormField";

// ── Shared Constants ──

const inputClass =
  "w-full bg-black border border-card-border rounded px-3 py-2 text-steel text-sm focus:outline-none focus:border-steel transition-colors";
const readOnlyClass =
  "w-full bg-card border border-card-border rounded px-3 py-2 text-chrome text-sm cursor-not-allowed";

// ── Base Props ──

interface BaseFieldProps {
  name: string;
  label: string;
  value: string | number | boolean;
  onChange: (name: string, value: string | number | boolean) => void;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  helpText?: string;
  error?: string;
}

// ── TextField ──

export function TextField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  placeholder,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="text"
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── TextArea ──

export function TextArea({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  placeholder,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <textarea
        rows={4}
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── NumberField ──

export function NumberField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  placeholder,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="number"
        value={value === "" || value === undefined ? "" : Number(value)}
        onChange={(e) =>
          onChange(name, e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── DateField ──

export function DateField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="date"
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── DateRangeField ──

export function DateRangeField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  const parts = String(value || "|").split("|");
  const start = parts[0] || "";
  const end = parts[1] || "";

  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={start}
          onChange={(e) => onChange(name, `${e.target.value}|${end}`)}
          readOnly={readOnly}
          className={readOnly ? readOnlyClass : inputClass}
        />
        <span className="text-chrome text-sm flex-shrink-0">to</span>
        <input
          type="date"
          value={end}
          onChange={(e) => onChange(name, `${start}|${e.target.value}`)}
          readOnly={readOnly}
          className={readOnly ? readOnlyClass : inputClass}
        />
      </div>
    </FormField>
  );
}

// ── SelectField ──

interface SelectFieldProps extends BaseFieldProps {
  options: { label: string; value: string }[];
}

export function SelectField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  options,
  helpText,
  error,
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <select
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// ── CheckboxField ──

export function CheckboxField({
  name,
  label,
  value,
  onChange,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label=""
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(name, e.target.checked)}
          disabled={readOnly}
          className="w-4 h-4 rounded border-card-border bg-black accent-steel"
        />
        <span className="text-sm text-steel">{label}</span>
      </label>
    </FormField>
  );
}

// ── CheckboxGroup ──

interface CheckboxGroupProps {
  name: string;
  label: string;
  value: string[];
  onChange: (name: string, value: string[]) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  readOnly?: boolean;
  helpText?: string;
  error?: string;
}

export function CheckboxGroup({
  name,
  label,
  value,
  onChange,
  options,
  required,
  readOnly,
  helpText,
  error,
}: CheckboxGroupProps) {
  const toggleItem = (itemValue: string) => {
    if (readOnly) return;
    const current = Array.isArray(value) ? value : [];
    const next = current.includes(itemValue)
      ? current.filter((v) => v !== itemValue)
      : [...current, itemValue];
    onChange(name, next);
  };

  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={Array.isArray(value) && value.includes(opt.value)}
              onChange={() => toggleItem(opt.value)}
              disabled={readOnly}
              className="w-4 h-4 rounded border-card-border bg-black accent-steel"
            />
            <span className="text-sm text-steel">{opt.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
}

// ── AddressField ──

export function AddressField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  let parsed = { street: "", city: "", state: "", zip: "" };
  try {
    if (typeof value === "string" && value) {
      parsed = JSON.parse(value);
    }
  } catch {
    // keep defaults
  }

  const update = (field: string, val: string) => {
    const next = { ...parsed, [field]: val };
    onChange(name, JSON.stringify(next));
  };

  const cls = readOnly ? readOnlyClass : inputClass;

  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <div className="space-y-2">
        <input
          type="text"
          value={parsed.street}
          onChange={(e) => update("street", e.target.value)}
          placeholder="Street address"
          readOnly={readOnly}
          className={cls}
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={parsed.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="City"
            readOnly={readOnly}
            className={cls}
          />
          <input
            type="text"
            value={parsed.state}
            onChange={(e) => update("state", e.target.value)}
            placeholder="State"
            readOnly={readOnly}
            className={cls}
          />
          <input
            type="text"
            value={parsed.zip}
            onChange={(e) => update("zip", e.target.value)}
            placeholder="ZIP"
            readOnly={readOnly}
            className={cls}
          />
        </div>
      </div>
    </FormField>
  );
}

// ── PhoneField ──

export function PhoneField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="tel"
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder="(555) 123-4567"
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── EmailField ──

export function EmailField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="email"
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder="email@example.com"
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── CurrencyField ──

export function CurrencyField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  placeholder,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-chrome text-sm">
          $
        </span>
        <input
          type="number"
          value={value === "" || value === undefined ? "" : Number(value)}
          onChange={(e) =>
            onChange(name, e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={placeholder || "0.00"}
          readOnly={readOnly}
          step="0.01"
          className={`${readOnly ? readOnlyClass : inputClass} pl-7`}
        />
      </div>
    </FormField>
  );
}

// ── TimeField ──

export function TimeField({
  name,
  label,
  value,
  onChange,
  required,
  readOnly,
  helpText,
  error,
}: BaseFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      readOnly={readOnly}
      helpText={helpText}
      error={error}
    >
      <input
        type="time"
        value={String(value || "")}
        onChange={(e) => onChange(name, e.target.value)}
        readOnly={readOnly}
        className={readOnly ? readOnlyClass : inputClass}
      />
    </FormField>
  );
}

// ── SignatureBlock ──

interface SignatureBlockProps {
  name: string;
  value: { signerName: string; agreed: boolean };
  onChange: (value: { signerName: string; agreed: boolean }) => void;
  error?: string;
}

export function SignatureBlock({
  name,
  value,
  onChange,
  error,
}: SignatureBlockProps) {
  const signerName = value?.signerName || "";
  const agreed = value?.agreed || false;

  return (
    <div className="border-t border-card-border pt-6 mt-6">
      <h3 className="font-heading text-lg font-bold text-steel uppercase tracking-wider mb-2">
        Signature
      </h3>
      <p className="text-chrome text-sm mb-4">
        By typing your name and checking the box below, you agree that this
        constitutes your legal electronic signature.
      </p>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-steel font-medium mb-1.5 block">
            Full Legal Name
            <span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={signerName}
            onChange={(e) =>
              onChange({ ...value, signerName: e.target.value })
            }
            placeholder="Type your full name"
            className={inputClass}
            id={`${name}-signer`}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) =>
              onChange({ ...value, agreed: e.target.checked })
            }
            className="w-4 h-4 rounded border-card-border bg-black accent-steel"
          />
          <span className="text-sm text-steel">
            I agree to the terms outlined in this document
          </span>
        </label>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

// ── Re-exports ──

export { default as FormField } from "./FormField";
export { default as FormSection } from "./FormSection";
