import { DB_NAME, DB_PASS, DB_USER } from "../utils/dotenv";
import {Pool} from "pg"
import {drizzle} from "drizzle-orm/node-postgres";
import { testSchema } from "./schemas/testSchema";
import { productSchema } from "./schemas/productSchema";
import { entitySchema } from "./schemas/entitySchema";
import { saleSchema } from "./schemas/saleSchema";
import { purchaseTable } from "./schemas/purchaseSchema";

const pool = new Pool({
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  ssl: false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
});

declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
}

const db = globalThis._db || drizzle(pool, { schema: { ...testSchema, ...productSchema, ...entitySchema, ...saleSchema, ...purchaseTable } });
globalThis._db = db;

export {db}