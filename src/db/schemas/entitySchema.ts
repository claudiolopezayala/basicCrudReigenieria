import { date, pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

export const entitySchema = pgSchema("entity")

export const employeeRoleEnum = entitySchema.enum("employee_role",[
  "manager",
  "cashier",
  "stock_keeper",
  "sales_rep"
])

export const employeeTable = entitySchema.table("employee",{
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  role: employeeRoleEnum("role"),
  hire_date: date("hire_date").notNull(),
})

export const clientTable = entitySchema.table("client",{
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  address: text("address"),
  created_at: timestamp("created_at").defaultNow()
})