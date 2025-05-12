DROP TRIGGER IF EXISTS before_upsert_room_participants ON "room_participants";--> statement-breakpoint
DROP FUNCTION IF EXISTS enforce_connection_constraints;--> statement-breakpoint

ALTER TABLE "room_participants" DROP COLUMN IF EXISTS "isConnected";--> statement-breakpoint
ALTER TABLE "room_participants" DROP COLUMN IF EXISTS "connectedAt";--> statement-breakpoint
ALTER TABLE "room_participants" DROP COLUMN IF EXISTS "disconnectedAt";--> statement-breakpoint
ALTER TABLE "room_participants" DROP COLUMN IF EXISTS "connectionCount";