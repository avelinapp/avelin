ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.33

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup pnpm and turbo on the alpine base
FROM alpine AS base
RUN npm install pnpm turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build the project
FROM base AS builder
ARG PROJECT

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final Node.js image
FROM alpine AS node_runner 
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD node dist/main

FROM oven/bun:${BUN_VERSION}-alpine AS bun_runner
ARG PROJECT

# RUN addgroup --system --gid 1001 bun
# RUN adduser --system --uid 1001 bun
USER bun

WORKDIR /app
COPY --from=builder --chown=bun:bun /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD bun run dist/main
