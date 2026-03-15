"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CREW_ROLES } from "@/lib/crm-types";
import type { CRMCrewMember } from "@/lib/crm-types";

interface CrewMemberFormProps {
  crew?: CRMCrewMember;
}

export default function CrewMemberForm({ crew }: CrewMemberFormProps) {
  const router = useRouter();
  const isEdit = !!crew;

  const [name, setName] = useState(crew?.name ?? "");
  const [role, setRole] = useState(crew?.role ?? "");
  const [email, setEmail] = useState(crew?.email ?? "");
  const [phone, setPhone] = useState(crew?.phone ?? "");
  const [dayRate, setDayRate] = useState(crew?.dayRate?.toString() ?? "");
  const [kitFee, setKitFee] = useState(crew?.kitFee?.toString() ?? "");
  const [city, setCity] = useState(crew?.city ?? "");
  const [state, setState] = useState(crew?.state ?? "");
  const [website, setWebsite] = useState(crew?.website ?? "");
  const [instagram, setInstagram] = useState(crew?.instagram ?? "");
  const [imdb, setImdb] = useState(crew?.imdb ?? "");
  const [w9OnFile, setW9OnFile] = useState(crew?.w9OnFile ?? false);
  const [ndaOnFile, setNdaOnFile] = useState(crew?.ndaOnFile ?? false);
  const [rating, setRating] = useState(crew?.rating?.toString() ?? "");
  const [tags, setTags] = useState(crew?.tags ?? "");
  const [notes, setNotes] = useState(crew?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSubmitting(true);

    const data = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      dayRate: dayRate ? Number(dayRate) : null,
      kitFee: kitFee ? Number(kitFee) : null,
      city: city.trim() || null,
      state: state.trim() || null,
      website: website.trim() || null,
      instagram: instagram.trim() || null,
      imdb: imdb.trim() || null,
      w9OnFile,
      ndaOnFile,
      rating: rating ? Number(rating) : null,
      tags: tags.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/crm/crew/${crew.id}`
        : "/api/crm/crew";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save crew member");
      }

      if (isEdit) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } else {
        const created = await res.json();
        router.push(`/admin/crew/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          {isEdit ? "Edit Crew Member" : "New Crew Member"}
        </h2>
        {saved && (
          <span className="ml-auto text-green-400 text-xs uppercase tracking-widest">Saved</span>
        )}
      </div>

      <div className="dashboard-card-body">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Section 1: Identity */}
          <h3 className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] border-b border-card-border pb-2">
            Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crew-name" className={labelClasses}>
                Name <span className="text-steel">*</span>
              </label>
              <input
                id="crew-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="crew-role" className={labelClasses}>
                Role <span className="text-steel">*</span>
              </label>
              <select
                id="crew-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={selectClasses}
                required
              >
                <option value="">Select role...</option>
                {CREW_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crew-email" className={labelClasses}>Email</label>
              <input
                id="crew-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="crew-phone" className={labelClasses}>Phone</label>
              <input
                id="crew-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Section 2: Rates */}
          <h3 className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] border-b border-card-border pb-2 mt-6">
            Rates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crew-dayrate" className={labelClasses}>Day Rate ($)</label>
              <input
                id="crew-dayrate"
                type="number"
                value={dayRate}
                onChange={(e) => setDayRate(e.target.value)}
                className={inputClasses}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="crew-kitfee" className={labelClasses}>Kit Fee ($)</label>
              <input
                id="crew-kitfee"
                type="number"
                value={kitFee}
                onChange={(e) => setKitFee(e.target.value)}
                className={inputClasses}
                min="0"
              />
            </div>
          </div>

          {/* Section 3: Location */}
          <h3 className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] border-b border-card-border pb-2 mt-6">
            Location
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crew-city" className={labelClasses}>City</label>
              <input
                id="crew-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="crew-state" className={labelClasses}>State</label>
              <input
                id="crew-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={inputClasses}
                placeholder="e.g. TX"
              />
            </div>
          </div>

          {/* Section 4: Links */}
          <h3 className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] border-b border-card-border pb-2 mt-6">
            Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="crew-website" className={labelClasses}>Website</label>
              <input
                id="crew-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="crew-instagram" className={labelClasses}>Instagram</label>
              <input
                id="crew-instagram"
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={inputClasses}
                placeholder="handle (no @)"
              />
            </div>
            <div>
              <label htmlFor="crew-imdb" className={labelClasses}>IMDb</label>
              <input
                id="crew-imdb"
                type="url"
                value={imdb}
                onChange={(e) => setImdb(e.target.value)}
                className={inputClasses}
                placeholder="https://imdb.com/..."
              />
            </div>
          </div>

          {/* Section 5: Admin */}
          <h3 className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] border-b border-card-border pb-2 mt-6">
            Admin
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <label className={`${labelClasses} mb-0`}>W-9 On File</label>
              <button
                type="button"
                onClick={() => setW9OnFile(!w9OnFile)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  w9OnFile ? "bg-green-500" : "bg-card-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    w9OnFile ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className={`${labelClasses} mb-0`}>NDA On File</label>
              <button
                type="button"
                onClick={() => setNdaOnFile(!ndaOnFile)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  ndaOnFile ? "bg-green-500" : "bg-card-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    ndaOnFile ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="crew-rating" className={labelClasses}>Rating (1-5)</label>
              <select
                id="crew-rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className={selectClasses}
              >
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="crew-tags" className={labelClasses}>Tags (comma-separated)</label>
              <input
                id="crew-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className={inputClasses}
                placeholder="e.g. reliable, owns-vehicle, bilingual"
              />
            </div>
          </div>
          <div>
            <label htmlFor="crew-notes" className={labelClasses}>Notes</label>
            <textarea
              id="crew-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={inputClasses}
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
            >
              {submitting ? "Saving..." : isEdit ? "Update Crew Member" : "Create Crew Member"}
            </button>

            <Link
              href="/admin/crew"
              className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
