ALTER TABLE "room_participants" ADD COLUMN "connectionCount" integer DEFAULT 0 NOT NULL;

CREATE OR REPLACE FUNCTION enforce_connection_constraints()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."connectionCount" <= 0 THEN
    NEW."connectionCount" := 0;
    NEW."isConnected" := FALSE;
  ELSE
    NEW."isConnected" := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint

-- Drop existing trigger if it exists (optional, for safety)
DROP TRIGGER IF EXISTS before_upsert_room_participants ON "room_participants";--> statement-breakpoint

CREATE TRIGGER before_upsert_room_participants
BEFORE INSERT OR UPDATE ON "room_participants"
FOR EACH ROW
EXECUTE FUNCTION enforce_connection_constraints();

