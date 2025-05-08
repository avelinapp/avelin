CREATE TABLE "room_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"roomId" text NOT NULL,
	"userId" text NOT NULL,
	"serverSessionId" text NOT NULL,
	"connectedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"disconnectedAt" timestamp with time zone,
	"isActive" boolean DEFAULT true NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "room_connections" ADD CONSTRAINT "room_connections_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_connections" ADD CONSTRAINT "room_connections_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;