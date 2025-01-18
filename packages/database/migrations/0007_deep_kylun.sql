UPDATE "rooms"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

UPDATE "room_participants"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

UPDATE "users"
SET "updatedAt" = "createdAt"
WHERE "updatedAt" IS NULL;

ALTER TABLE "room_participants" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "room_participants" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "rooms" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET NOT NULL;
