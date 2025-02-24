CREATE SCHEMA "purchase";
--> statement-breakpoint
CREATE TABLE "purchase"."purchase" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"price" numeric,
	"payment_method" text
);
