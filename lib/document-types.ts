import type {
  DocumentCategory,
  DocumentStatus,
  CrewInvoiceStatus,
  PaymentMethod,
} from "@prisma/client";

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

export interface FieldSchema {
  sections: SectionDefinition[];
}

export interface DocumentTemplateData {
  name: string;
  slug: string;
  category: DocumentCategory;
  description: string;
  requiresSignature: boolean;
  isExternal: boolean;
  fieldSchema: FieldSchema;
}

export interface DocumentWithRelations {
  id: string;
  templateId: string;
  template: {
    id: string;
    name: string;
    slug: string;
    category: DocumentCategory;
    requiresSignature: boolean;
    isExternal: boolean;
    fieldSchema: FieldSchema;
  };
  projectId: string | null;
  project: {
    id: string;
    title: string;
  } | null;
  token: string;
  status: DocumentStatus;
  formData: Record<string, unknown>;
  recipientName: string | null;
  recipientEmail: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  signature: {
    id: string;
    signerName: string;
    signerIP: string;
    userAgent: string;
    agreedAt: string;
  } | null;
  crewInvoice: {
    id: string;
    crewMemberId: string;
    crewMember: {
      id: string;
      name: string;
    };
    paymentMethod: PaymentMethod | null;
    paymentDetails: Record<string, unknown> | null;
    status: CrewInvoiceStatus;
    paidAt: string | null;
    paidNote: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicDocumentData {
  token: string;
  status: DocumentStatus;
  templateName: string;
  templateSlug: string;
  category: DocumentCategory;
  requiresSignature: boolean;
  fieldSchema: FieldSchema;
  formData: Record<string, unknown>;
  projectName: string | null;
  recipientName: string | null;
  expiresAt: string | null;
}

export type { DocumentCategory, DocumentStatus, CrewInvoiceStatus, PaymentMethod };
