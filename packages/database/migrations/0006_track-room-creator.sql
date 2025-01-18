--> Create a system user
INSERT INTO "users" (
  id,
  email,
  name,
  "isAnonymous"
) VALUES (
  'user_system',
  'user_system@system.avelin.app',
  'Avelin',
  FALSE
)
ON CONFLICT (id) DO NOTHING;

--> Add timstamps to `rooms` table
ALTER TABLE "rooms" ADD COLUMN "updatedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "deletedAt" timestamp with time zone;--> statement-breakpoint

--> Add `creatorId` column to `rooms` table; optional until we migrate data in next step
ALTER TABLE "rooms" ADD COLUMN "creatorId" text;--> statement-breakpoint

--> Update rooms to have a creatorId; set to system user
UPDATE "rooms"
SET "creatorId" = 'user_system'
WHERE "creatorId" IS NULL;

--> Update `creatorId` column to be required
-- This should only be done, once APIs have been updated to set a creatorId upon room creation
--> ALTER TABLE "rooms"
--> ALTER COLUMN "creatorId" SET NOT NULL;

--> Add foreign key constraint to `rooms` table
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_creatorId_users_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
