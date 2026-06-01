import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env");
config({ path: envPath });

const requiredEnvVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASS", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Variaveis de ambiente obrigatorias ausentes: ${missingEnvVars.join(", ")}`
  );
}

const databaseUrl = `postgresql://${encodeURIComponent(
  process.env.DB_USER
)}:${encodeURIComponent(process.env.DB_PASS)}@${process.env.DB_HOST}:${
  process.env.DB_PORT
}/${process.env.DB_NAME}`;

const db = new PrismaClient({
  datasourceUrl: databaseUrl,
  log: ["query", "error", "warn"],
});

export default db;
