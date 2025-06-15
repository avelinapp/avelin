ALTER TABLE "rooms" ALTER COLUMN "staticSlug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isAdminUser" boolean DEFAULT false NOT NULL;