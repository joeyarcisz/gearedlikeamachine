"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ContactTable from "@/components/admin/ContactTable";
import SlideOutPanel from "@/components/admin/SlideOutPanel";
import ContactQuickPanel from "@/components/admin/ContactQuickPanel";
import type { CRMContact } from "@/lib/crm-types";

interface ContactsPageClientProps {
  contacts: CRMContact[];
}

export default function ContactsPageClient({
  contacts: initialContacts,
}: ContactsPageClientProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);

  const handleStageChange = useCallback(
    (contactId: string, newStage: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, stage: newStage } : c))
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact((prev) =>
          prev ? { ...prev, stage: newStage } : null
        );
      }
    },
    [selectedContact]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Contacts
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {contacts.length} total
          </span>
          <Link
            href="/admin/contacts/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
          >
            + New Contact
          </Link>
        </div>
      </div>
      <ContactTable
        contacts={contacts}
        onSelectContact={setSelectedContact}
      />

      <SlideOutPanel
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      >
        {selectedContact && (
          <ContactQuickPanel
            contact={selectedContact}
            onStageChange={handleStageChange}
            onClose={() => setSelectedContact(null)}
          />
        )}
      </SlideOutPanel>
    </div>
  );
}
