ARG NODE_VERSION=20
ARG PROJECT=web
ARG PACKAGE=@avelin/${PROJECT}

# 1. Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
# RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN corepack enable
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN npm install turbo@2.1.3 --global
RUN npm install turbo --global

RUN 

# 2. Prune projects
FROM base AS pruner
# https://stackoverflow.com/questions/49681984/how-to-get-version-value-of-package-json-inside-of-dockerfile
# RUN export VERSION=$(npm run version)

ARG PACKAGE

# Set working directory
WORKDIR /app

# It might be the path to <ROOT> turborepo
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "@acme/nextjs" is the name entered in the project's package.json: { name: "@acme/nextjs" }
RUN turbo prune --scope=${PACKAGE} --docker
 
# 3. Build the project
FROM base AS builder
ARG PACKAGE

# Environment to skip .env validation on build
ENV CI=true

# Environment variables for the client
ARG NEXT_PUBLIC_APP_URL \
  NEXT_PUBLIC_API_URL \
  NEXT_PUBLIC_SYNC_URL

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
  NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
  NEXT_PUBLIC_SYNC_URL=${NEXT_PUBLIC_SYNC_URL}  


WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm set package-import-method copy && \
    pnpm install --frozen-lockfile
 
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm build --filter=${PACKAGE}

FROM alpine AS runner

ARG PROJECT

# Don't run production as root
USER 1001 

WORKDIR /app

ARG APP_PORT=3000

ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    APP_PORT=${APP_PORT}

EXPOSE ${APP_PORT}

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1001:1001 /app/apps/web/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=1001:1001 /app/apps/web/public ./apps/web/public

CMD ["node" , "apps/web/server.js"]
