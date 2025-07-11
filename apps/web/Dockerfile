ARG NODE_VERSION=20.18.3
ARG PROJECT=web
ARG PACKAGE=@avelin/${PROJECT}
ARG UBI9_VERSION=9.5
ARG RUNTIME=node

FROM ghcr.io/bazzalabs/ubi:node-${NODE_VERSION} AS ubi

# Setup pnpm and turbo on the alpine base
FROM ubi AS base

RUN npm install pnpm turbo --global

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
  NEXT_PUBLIC_SYNC_URL \
  NEXT_PUBLIC_ZERO_URL \
  NEXT_PUBLIC_BASE_DOMAIN \
  NEXT_PUBLIC_POSTHOG_KEY \
  RUNTIME \
  NODE_VERSION \
  TURBO_TEAM \
  TURBO_TOKEN

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
  NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
  NEXT_PUBLIC_SYNC_URL=${NEXT_PUBLIC_SYNC_URL} \
  NEXT_PUBLIC_ZERO_URL=${NEXT_PUBLIC_ZERO_URL} \
  NEXT_PUBLIC_BASE_DOMAIN=${NEXT_PUBLIC_BASE_DOMAIN} \
  NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY} \
  NEXT_PUBLIC_RUNTIME=${RUNTIME} \
  NEXT_PUBLIC_NODE_VERSION=${NODE_VERSION} \
  TURBO_TEAM=${TURBO_TEAM} \
  TURBO_TOKEN=${TURBO_TOKEN}

# Fixes builds on linux/arm64
RUN microdnf install -y \
  libgcc libstdc++ unzip gcc-c++ make python3 \
  && microdnf clean all

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

FROM ubi AS runner

ARG PROJECT

ARG NODE_VERSION \
  RUNTIME

ENV NODE_VERSION=${NODE_VERSION} \
  RUNTIME=${RUNTIME}

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
