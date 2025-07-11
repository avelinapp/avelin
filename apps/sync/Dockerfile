ARG NODE_VERSION=20.18.3
ARG PROJECT=sync
ARG PACKAGE=@avelin/${PROJECT}
ARG UBI9_VERSION=9.5

FROM ghcr.io/bazzalabs/ubi:node-${NODE_VERSION} AS ubi

# Setup pnpm and turbo on the alpine base
FROM ubi AS base

RUN npm install pnpm turbo --global

# 2. Prune projects
FROM base AS pruner

ARG PACKAGE

# Set working directory
WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune --scope=${PACKAGE} --docker

# 3. Build the project
FROM base AS builder
ARG PACKAGE 

ARG TURBO_TEAM \
  TURBO_TOKEN

ENV TURBO_TEAM=${TURBO_TEAM} \
  TURBO_TOKEN=${TURBO_TOKEN}

# Environment to skip .env validation on build
ENV CI=true

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
  pnpm install --no-frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm build --filter=${PACKAGE}

###### @avelin/sync
FROM ubi AS runner 

ARG PROJECT

ENV NODE_ENV=production

# Don't run production as root
USER 1001 

WORKDIR /app

COPY --from=builder --chown=1001:1001 /app/ .

ARG API_PORT=4100
ENV API_PORT=${API_PORT}

EXPOSE ${API_PORT}

CMD ["node", "apps/sync/dist/index.js"]
