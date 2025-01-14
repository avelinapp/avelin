# Test containers locally

```
dkb -t avelin-web -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL="http://localhost:4000" \
  --build-arg NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  --build-arg NEXT_PUBLIC_SYNC_URL="ws://localhost:4100" \
  --build-arg NEXT_PUBLIC_POSTHOG_KEY="phc_4s0Gh7WXdyRfgClh8B8L5nZ2o2qGxWjuA4P5s7ytW3k" \
  .
dkr -it --rm --name avelin-web --env-file apps/web/.env avelin-web

dkb -t avelin-api -f apps/api/Dockerfile .
dkr -it --rm --name avelin-api --env-file apps/api/.env avelin-api

dkb -t avelin-sync -f apps/sync/Dockerfile .
dkr -it --rm --name avelin-sync --env-file apps/sync/.env avelin-sync

dkb -t avelin-migrate -f packages/database/Dockerfile .
dkr -it --rm --name avelin-migrate -e DATABASE_URL=$(dotenv -e packages/database/.env -p DATABASE_URL) avelin-migrate
```
