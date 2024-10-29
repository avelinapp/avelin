ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.33
ARG PROJECT=api
ARG PACKAGE=@avelin/${PROJECT}

# 1. Alpine image
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-alpine AS alpine
RUN apk update
# RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN corepack enable
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN npm install turbo@2.1.3 --global
RUN npm install turbo --global

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
    pnpm install --frozen-lockfile
 
# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm compile --filter=${PACKAGE}

###### @avelin/api
FROM oven/bun:${BUN_VERSION}-alpine AS runner 
ARG PROJECT

# Don't run production as root
USER 1001 

WORKDIR /app

COPY --from=builder --chown=1001:1001 /app/apps/${PROJECT}/api .

ARG API_PORT=4000
ENV API_PORT=${API_PORT}

EXPOSE ${API_PORT}

CMD ["sh", "-c", "./api"] 
