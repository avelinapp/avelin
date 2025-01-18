ALTER TABLE "room_participants" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone USING "updatedAt" AT TIME ZONE 'UTC';
ALTER TABLE "room_participants" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone USING "createdAt" AT TIME ZONE 'UTC';
ALTER TABLE "room_participants" ALTER COLUMN "deletedAt" SET DATA TYPE timestamp with time zone USING "deletedAt" AT TIME ZONE 'UTC';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone USING "updatedAt" AT TIME ZONE 'UTC';
ALTER TABLE "users" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone USING "createdAt" AT TIME ZONE 'UTC';
ALTER TABLE "users" ALTER COLUMN "deletedAt" SET DATA TYPE timestamp with time zone USING "deletedAt" AT TIME ZONE 'UTC';
