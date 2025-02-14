import { pgSchema, serial, timestamp } from "drizzle-orm/pg-core";

export const testSchema= pgSchema("test");

export const testTable = testSchema.table("test",{
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at").defaultNow(),
})