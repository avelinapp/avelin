ALTER TABLE "room_participants" ADD COLUMN "isConnected" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "room_participants" ADD COLUMN "connectedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "room_participants" ADD COLUMN "disconnectedAt" timestamp with time zone;