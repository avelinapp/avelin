ARG NODE_VERSION=20.18.3
ARG BUN_VERSION=1.1.43
ARG PROJECT=api
ARG PACKAGE=@avelin/${PROJECT}
ARG UBI9_VERSION=9.5

FROM ghcr.io/bazzalabs/ubi:bun-${BUN_VERSION}-node-${NODE_VERSION} AS ubi

# FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-debian AS base
FROM ubi AS base

RUN npm install --global \
  turbo \
  pnpm

# 2. Prune projects
FROM base AS pruner

ARG PACKAGE

WORKDIR /app

COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune --scope=${PACKAGE} --docker

# 3. Build the project
FROM base AS builder
ARG PACKAGE

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
  pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm compile --filter=${PACKAGE}

###### @avelin/api
FROM redhat/ubi9-micro:${UBI9_VERSION} AS runner 

ARG PROJECT

# Don't run production as root
USER 1001 

WORKDIR /app

COPY --from=builder --chown=1001:1001 /app/apps/${PROJECT}/api .

ARG API_PORT=4000
ENV API_PORT=${API_PORT}

EXPOSE ${API_PORT}

CMD ["./api"]
