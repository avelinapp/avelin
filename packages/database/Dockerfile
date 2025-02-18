ARG NODE_VERSION=20.18.3
ARG PROJECT=database
ARG PACKAGE=@avelin/${PROJECT}

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

WORKDIR /app/packages/database

CMD ["pnpm", "tsx", "./src/migrate.ts"]
