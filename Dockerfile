ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.33
ARG PROJECT
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

###### @avelin/api
FROM alpine AS runner-api
ARG PROJECT
 
# Don't run production as root
USER 1001 

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder --chown=1001:1001 /app/apps/${PROJECT} .

ARG API_PORT=3000
ENV API_PORT=${API_PORT}
EXPOSE ${API_PORT}

CMD ["sh", "-c", "./main"] 

###### @avelin/web
FROM alpine AS runner-web

ARG PROJECT

# Don't run production as root
USER 1001 

WORKDIR /app

ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

ARG API_PORT=3000
ENV API_PORT=${API_PORT}
EXPOSE ${API_PORT}
 
CMD node apps/web/server.js
