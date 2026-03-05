"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface EmailComposeProps {
  contactId: string;
  contactEmail: string;
  contactName: string;
  contactStage: string;
  contactCompany?: string | null;
}

interface EmailTemplate {
  label: string;
  subject: string;
  message: string;
}

function getTemplates(firstName: string, company: string | null): EmailTemplate[] {
  const companyLine = company ? ` at ${company}` : "";

  return [
    {
      label: "Custom",
      subject: "",
      message: "",
    },
    {
      label: "Lead: Introduction",
      subject: `Connecting with you${companyLine}`,
      message: `Hey ${firstName},

Thanks for connecting. I'd love to learn more about what you're working on and see if there's a way we can collaborate.

We handle full-service video production and equipment rentals out of DFW. If you've got anything coming up, I'd be happy to chat about it.

Looking forward to hearing from you.

Joey Arcisz
Geared Like A Machine`,
    },
    {
      label: "Qualifying: Next Steps",
      subject: "Following up on our conversation",
      message: `Hey ${firstName},

Following up on our conversation. I've been thinking about what you shared and here's what I'm thinking for next steps.

Would love to set up a quick call to walk through it. What does your schedule look like this week?

Talk soon,

Joey Arcisz
Geared Like A Machine`,
    },
    {
      label: "Active: Check-In",
      subject: "Quick check-in",
      message: `Hey ${firstName},

Just checking in to see how things are going on your end. If anything has shifted or you're ready to move forward, I'm here.

Let me know what works for a quick chat.

Joey Arcisz
Geared Like A Machine`,
    },
    {
      label: "Past Client: Reconnect",
      subject: "Good to reconnect",
      message: `Hey ${firstName},

It's been a while! Wanted to reach out and see what you've got coming up. We've been growing the operation over here and I'd love to work together again.

If you've got any projects on the horizon, let's talk.

Joey Arcisz
Geared Like A Machine`,
    },
  ];
}

const stageTemplateMap: Record<string, string> = {
  lead: "Lead: Introduction",
  qualifying: "Qualifying: Next Steps",
  active_contact: "Active: Check-In",
  active_conversation: "Active: Check-In",
  client_account: "Active: Check-In",
  client_past: "Past Client: Reconnect",
  inactive_contact: "Past Client: Reconnect",
};

export default function EmailCompose({
  contactId,
  contactEmail,
  contactName,
  contactStage,
  contactCompany,
}: EmailComposeProps) {
  const router = useRouter();
  const firstName = contactName.split(" ")[0];
  const templates = getTemplates(firstName, contactCompany ?? null);

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Custom");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleOpen() {
    // Auto-select the template that matches the contact's current stage
    const suggestedLabel = stageTemplateMap[contactStage];
    const template = templates.find((t) => t.label === suggestedLabel);
    if (template) {
      setSelectedTemplate(template.label);
      setSubject(template.subject);
      setMessage(template.message);
    }
    setOpen(true);
  }

  function handleTemplateChange(label: string) {
    setSelectedTemplate(label);
    const template = templates.find((t) => t.label === label);
    if (template) {
      setSubject(template.subject);
      setMessage(template.message);
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);

    try {
      const res = await fetch(`/api/crm/contacts/${contactId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send email");
      }

      setSent(true);
      setSubject("");
      setMessage("");
      setSelectedTemplate("Custom");
      setTimeout(() => {
        setSent(false);
        setOpen(false);
        router.refresh();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  if (!open) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Email
          </h2>
          <button
            onClick={handleOpen}
            className="ml-auto bg-steel text-black px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)]"
          >
            Send Email
          </button>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Email
          </h2>
        </div>
        <div className="dashboard-card-body">
          <p className="text-green-400 text-sm">Email sent to {contactName}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Send Email to {contactName}
        </h2>
        <button
          onClick={() => setOpen(false)}
          className="ml-auto text-muted hover:text-white text-xs transition-colors"
        >
          Cancel
        </button>
      </div>
      <div className="dashboard-card-body">
        <form onSubmit={handleSend} className="space-y-4 max-w-2xl">
          <p className="text-muted text-xs">
            To: {contactEmail}
          </p>

          {/* Template picker */}
          <div>
            <label htmlFor="email-template" className={labelClasses}>
              Template
            </label>
            <select
              id="email-template"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className={selectClasses}
            >
              {templates.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email-subject" className={labelClasses}>
              Subject
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="email-message" className={labelClasses}>
              Message
            </label>
            <textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className={inputClasses}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={sending}
              className="bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
