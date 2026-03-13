import { PrismaClient, DocumentCategory } from "@prisma/client";
import { documentTemplates } from "../lib/document-templates";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_PRISMA_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding document templates...");

  let count = 0;
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
    count++;
    console.log(`  ✓ ${tmpl.name}`);
  }

  console.log(`\nDone! Upserted ${count} document templates.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
