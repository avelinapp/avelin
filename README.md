# Test containers locally

```
dkb -t avelin-web -f apps/web/Dockerfile .
dkr --it --rm --name avelin-web --env-file apps/web/.env avelin-web

dkb -t avelin-api -f apps/api/Dockerfile .
dkr --it --rm --name avelin-api --env-file apps/api/.env avelin-api

dkb -t avelin-sync -f apps/sync/Dockerfile .
dkr --it --rm --name avelin-sync --env-file apps/sync/.env avelin-sync

dkb -t avelin-migrate -f packages/database/Dockerfile .
dkr --it --rm --name avelin-migrate --env-file packages/database/.env avelin-migrate
```
