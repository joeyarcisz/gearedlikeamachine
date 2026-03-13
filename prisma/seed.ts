import { PrismaClient, ContactStage, OpportunityStage, DocumentCategory } from "@prisma/client";
import { documentTemplates } from "../lib/document-templates";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { join } from "path";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL!,
});
const prisma = new PrismaClient({ adapter });

// Simple CSV parser that handles quoted fields with commas
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split("\n");
  if (lines.length < 2) return [];

  const headers = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];

  let i = 1;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }

    // Handle multi-line quoted fields
    let fullLine = lines[i];
    while (countQuotes(fullLine) % 2 !== 0 && i + 1 < lines.length) {
      i++;
      fullLine += "\n" + lines[i];
    }

    const values = parseLine(fullLine);
    const row: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] || "").trim();
    }
    rows.push(row);
    i++;
  }

  return rows;
}

function countQuotes(s: string): number {
  let count = 0;
  for (const c of s) if (c === '"') count++;
  return count;
}

function parseLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

const CONTACT_STAGE_MAP: Record<string, ContactStage> = {
  lead: "lead",
  qualifying: "qualifying",
  active_contact: "active_contact",
  active_conversation: "active_conversation",
  client_account: "client_account",
  client_past: "client_past",
  inactive_contact: "inactive_contact",
  inbound_new: "lead", // Map inbound_new → lead
};

const OPPORTUNITY_STAGE_MAP: Record<string, OpportunityStage> = {
  lead: "lead",
  qualification: "qualification",
  qualifying: "qualification", // Normalize
  proposal: "proposal",
  negotiation: "negotiation",
  waiting_client_feedback: "waiting_client_feedback",
  nurture_reactivation: "nurture_reactivation",
  won: "won",
  lost: "lost",
  deferred: "deferred",
};

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.opportunity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.adminSession.deleteMany();

  // --- Contacts ---
  const contactsCsv = readFileSync(
    join(__dirname, "data/contacts.csv"),
    "utf-8"
  );
  const contactRows = parseCSV(contactsCsv);

  // Track email→id to avoid dupes, and name→id for pipeline linking
  const emailSet = new Set<string>();
  const nameToId = new Map<string, string>();
  let contactCount = 0;
  let skipped = 0;

  for (const row of contactRows) {
    const name = row.name?.trim();
    if (!name) {
      skipped++;
      continue;
    }

    const email = row.email?.trim() || null;

    // Skip duplicate emails
    if (email && emailSet.has(email.toLowerCase())) {
      skipped++;
      continue;
    }
    if (email) emailSet.add(email.toLowerCase());

    const stageLower = (row.stage || "lead").toLowerCase().trim();
    const stage = CONTACT_STAGE_MAP[stageLower] || "lead";

    const contact = await prisma.contact.create({
      data: {
        name,
        company: row.company?.trim() || null,
        email,
        phone: row.phone?.trim() || null,
        stage,
        lastContact: row.last_contact ? new Date(row.last_contact) : null,
        nextAction: row.next_action?.trim() || null,
        notes: row.notes?.trim() || null,
        sourceFiles: row.source_files?.trim() || null,
      },
    });

    nameToId.set(name.toLowerCase(), contact.id);
    contactCount++;
  }

  console.log(
    `Created ${contactCount} contacts (${skipped} skipped/duplicates)`
  );

  // --- Pipeline ---
  const pipelineCsv = readFileSync(
    join(__dirname, "data/pipeline.csv"),
    "utf-8"
  );
  const pipelineRows = parseCSV(pipelineCsv);
  let oppCount = 0;

  for (const row of pipelineRows) {
    const title = row.project?.trim();
    if (!title) continue;

    const stageLower = (row.stage || "lead").toLowerCase().trim();
    const stage = OPPORTUNITY_STAGE_MAP[stageLower] || "lead";

    // Resolve contact by name
    const contactName = row.contact_name?.trim().toLowerCase();
    // Try exact match first, then first name match
    let contactId: string | null = null;
    if (contactName) {
      contactId = nameToId.get(contactName) ?? null;
      if (!contactId) {
        // Try matching first part (e.g., "Meghan/Sanica" → "Meghan")
        const firstName = contactName.split("/")[0].trim();
        for (const [key, id] of nameToId) {
          if (key.startsWith(firstName) || key.includes(firstName)) {
            contactId = id;
            break;
          }
        }
      }
    }

    await prisma.opportunity.create({
      data: {
        title,
        company: row.company?.trim() || null,
        stage,
        estimatedValueLow: row.estimated_value_low
          ? parseInt(row.estimated_value_low)
          : null,
        estimatedValueHigh: row.estimated_value_high
          ? parseInt(row.estimated_value_high)
          : null,
        lastTouch: row.last_touch ? new Date(row.last_touch) : null,
        nextAction: row.next_action?.trim() || null,
        owner: row.owner?.trim() || null,
        priority: row.priority?.trim() || null,
        notes: row.notes?.trim() || null,
        contactId,
      },
    });

    oppCount++;
  }

  console.log(`Created ${oppCount} opportunities`);

  // --- Document Templates (idempotent upsert) ---
  let templateCount = 0;
  for (const tmpl of documentTemplates) {
    await prisma.documentTemplate.upsert({
      where: { slug: tmpl.slug },
      update: {
        name: tmpl.name,
        category: tmpl.category as DocumentCategory,
        description: tmpl.description,
        requiresSignature: tmpl.requiresSignature,
        isExternal: tmpl.isExternal,
        fieldSchema: tmpl.fieldSchema as object,
      },
      create: {
        name: tmpl.name,
        slug: tmpl.slug,
        category: tmpl.category as DocumentCategory,
        description: tmpl.description,
        requiresSignature: tmpl.requiresSignature,
        isExternal: tmpl.isExternal,
        fieldSchema: tmpl.fieldSchema as object,
      },
    });
    templateCount++;
  }
  console.log(`Upserted ${templateCount} document templates`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
