import { defineConfig } from "drizzle-kit";
import { DB_IP, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "./src/utils/dotenv";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    host: DB_IP,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    ssl: false,
  },
});
