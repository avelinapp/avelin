WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "roomId", "userId"
      ORDER BY "lastAccessedAt" DESC
    ) AS rn
  FROM
    "room_participants"
)
DELETE FROM
  "room_participants"
WHERE
  id IN (
    SELECT id FROM duplicates WHERE rn > 1
  );--> statement-breakpoint

ALTER TABLE room_participants DROP CONSTRAINT IF EXISTS room_participants_pkey;--> statement-breakpoint
ALTER TABLE "room_participants" ADD CONSTRAINT "room_participants_roomId_userId_pk" PRIMARY KEY("roomId","userId");--> statement-breakpoint
ALTER TABLE "room_participants" DROP COLUMN "id";
