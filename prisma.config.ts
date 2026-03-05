import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.POSTGRES_URL_NON_POOLING ?? "",
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
