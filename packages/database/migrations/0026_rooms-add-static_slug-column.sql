ALTER TABLE "rooms" ADD COLUMN "staticSlug" text;--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_staticSlug_unique" UNIQUE("staticSlug");