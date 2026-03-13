export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "dateRange"
  | "select"
  | "checkbox"
  | "checkboxGroup"
  | "address"
  | "phone"
  | "email"
  | "currency"
  | "time"
  | "crewSelector"
  | "projectSelector";

export interface FieldDefinition {
  name: string;
  type: FieldType;
  label: string;
  required?: boolean;
  prefilledByAdmin?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean;
}

export interface SectionDefinition {
  title: string;
  description?: string;
  fields: FieldDefinition[];
}

// Alias for compatibility
export type FieldSchemaSection = SectionDefinition;

export interface FieldSchema {
  sections: SectionDefinition[];
}

export interface DocumentTemplateData {
  name: string;
  slug: string;
  category: string;
  description: string;
  requiresSignature: boolean;
  isExternal: boolean;
  fieldSchema: FieldSchema;
}

export interface PublicDocumentData {
  token: string;
  status: string;
  templateName: string;
  templateSlug: string;
  category: string;
  requiresSignature: boolean;
  fieldSchema: FieldSchema;
  formData: Record<string, unknown>;
  projectName: string | null;
  recipientName: string | null;
  expiresAt: string | null;
  completedAt?: string | null;
}
