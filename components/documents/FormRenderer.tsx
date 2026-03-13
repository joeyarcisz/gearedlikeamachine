"use client";

import React from "react";
import type { FieldSchema, FieldDefinition } from "@/lib/document-types";
import {
  FormSection,
  TextField,
  TextArea,
  NumberField,
  DateField,
  DateRangeField,
  SelectField,
  CheckboxField,
  CheckboxGroup,
  AddressField,
  PhoneField,
  EmailField,
  CurrencyField,
  TimeField,
  SignatureBlock,
} from "./fields";

interface FormRendererProps {
  fieldSchema: FieldSchema;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  isAdmin?: boolean;
  requiresSignature?: boolean;
  signatureData?: { signerName: string; agreed: boolean };
  onSignatureChange?: (value: { signerName: string; agreed: boolean }) => void;
  errors?: Record<string, string>;
}

export default function FormRenderer({
  fieldSchema,
  formData,
  onChange,
  isAdmin,
  requiresSignature,
  signatureData,
  onSignatureChange,
  errors,
}: FormRendererProps) {
  const handleFieldChange = (
    name: string,
    value: string | number | boolean | string[]
  ) => {
    onChange({ ...formData, [name]: value });
  };

  const renderField = (field: FieldDefinition) => {
    const readOnly = isAdmin
      ? !field.prefilledByAdmin
      : !!field.prefilledByAdmin;

    // In admin view, only show admin-prefilled fields
    if (isAdmin && !field.prefilledByAdmin) return null;

    const baseProps = {
      name: field.name,
      label: field.label,
      value: (formData[field.name] as string | number | boolean) ?? "",
      onChange: handleFieldChange,
      required: field.required,
      readOnly,
      placeholder: field.placeholder,
      helpText: field.helpText,
      error: errors?.[field.name],
    };

    switch (field.type) {
      case "text":
        return <TextField key={field.name} {...baseProps} />;
      case "textarea":
        return <TextArea key={field.name} {...baseProps} />;
      case "number":
        return <NumberField key={field.name} {...baseProps} />;
      case "date":
        return <DateField key={field.name} {...baseProps} />;
      case "dateRange":
        return <DateRangeField key={field.name} {...baseProps} />;
      case "select":
        return (
          <SelectField
            key={field.name}
            {...baseProps}
            options={field.options || []}
          />
        );
      case "checkbox":
        return <CheckboxField key={field.name} {...baseProps} />;
      case "checkboxGroup":
        return (
          <CheckboxGroup
            key={field.name}
            name={field.name}
            label={field.label}
            value={(formData[field.name] as string[]) || []}
            onChange={handleFieldChange}
            options={field.options || []}
            required={field.required}
            readOnly={readOnly}
            helpText={field.helpText}
            error={errors?.[field.name]}
          />
        );
      case "address":
        return <AddressField key={field.name} {...baseProps} />;
      case "phone":
        return <PhoneField key={field.name} {...baseProps} />;
      case "email":
        return <EmailField key={field.name} {...baseProps} />;
      case "currency":
        return <CurrencyField key={field.name} {...baseProps} />;
      case "time":
        return <TimeField key={field.name} {...baseProps} />;
      default:
        return <TextField key={field.name} {...baseProps} />;
    }
  };

  return (
    <div>
      {fieldSchema.sections.map((section, idx) => {
        const renderedFields = section.fields
          .map(renderField)
          .filter(Boolean);

        // Skip empty sections
        if (renderedFields.length === 0) return null;

        return (
          <FormSection
            key={idx}
            title={section.title}
            description={section.description}
          >
            <div className="space-y-4">{renderedFields}</div>
          </FormSection>
        );
      })}

      {requiresSignature && !isAdmin && onSignatureChange && (
        <SignatureBlock
          name="signature"
          value={signatureData || { signerName: "", agreed: false }}
          onChange={onSignatureChange}
          error={errors?.signature}
        />
      )}
    </div>
  );
}
