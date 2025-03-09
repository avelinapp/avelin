TRUNCATE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "token" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "ipAddress" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "userAgent" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");
