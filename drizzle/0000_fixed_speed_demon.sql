CREATE SCHEMA "test";
--> statement-breakpoint
CREATE TABLE "test"."test" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now()
);
