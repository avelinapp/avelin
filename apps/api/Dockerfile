ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.43
ARG PROJECT=api
ARG PACKAGE=@avelin/${PROJECT}

# 1. Alpine image
FROM imbios/bun-node:${BUN_VERSION}-${NODE_VERSION}-alpine AS alpine-base
RUN apk update

# Setup pnpm and turbo on the alpine base
FROM alpine-base AS base
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
FROM alpine:3.18 AS runner 

# Custom `glibc` installation was taken from:
# https://github.com/ImBIOS/bun-node/blob/main/src/base/20/alpine/dockerfile

# TODO: Instead of downloading glibc from a third-party source, we should
#      build it from source. This is a temporary solution.
#      See: https://github.com/sgerrand/alpine-pkg-glibc

# https://github.com/sgerrand/alpine-pkg-glibc/releases
# https://github.com/sgerrand/alpine-pkg-glibc/issues/176
ARG GLIBC_VERSION=2.34-r0

# https://github.com/oven-sh/bun/issues/5545#issuecomment-1722461083
ARG GLIBC_VERSION_AARCH64=2.26-r1

RUN apk --no-cache add \
  ca-certificates \
  curl \
  dirmngr \
  gpg \
  gpg-agent \
  unzip \
  && arch="$(apk --print-arch)" \
  && case "${arch##*-}" in \
  x86_64) build="x64-baseline";; \
  aarch64) build="aarch64";; \
  *) echo "error: unsupported architecture: $arch"; exit 1 ;; \
  esac \
  && cd /tmp \
  && case "${arch##*-}" in \
  x86_64) curl "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" \
  -fsSLO \
  --compressed \
  --retry 5 \
  || (echo "error: failed to download: glibc v${GLIBC_VERSION}" && exit 1) \
  && mv "glibc-${GLIBC_VERSION}.apk" glibc.apk \
  && curl "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" \
  -fsSLO \
  --compressed \
  --retry 5 \
  || (echo "error: failed to download: glibc-bin v${GLIBC_VERSION}" && exit 1) \
  && mv "glibc-bin-${GLIBC_VERSION}.apk" glibc-bin.apk ;; \
  aarch64) curl "https://raw.githubusercontent.com/squishyu/alpine-pkg-glibc-aarch64-bin/master/glibc-${GLIBC_VERSION_AARCH64}.apk" \
  -fsSLO \
  --compressed \
  --retry 5 \
  || (echo "error: failed to download: glibc v${GLIBC_VERSION_AARCH64}" && exit 1) \
  && mv "glibc-${GLIBC_VERSION_AARCH64}.apk" glibc.apk \
  && curl "https://raw.githubusercontent.com/squishyu/alpine-pkg-glibc-aarch64-bin/master/glibc-bin-${GLIBC_VERSION_AARCH64}.apk" \
  -fsSLO \
  --compressed \
  --retry 5 \
  || (echo "error: failed to download: glibc-bin v${GLIBC_VERSION_AARCH64}" && exit 1) \
  && mv "glibc-bin-${GLIBC_VERSION_AARCH64}.apk" glibc-bin.apk ;; \
  *) echo "error: unsupported architecture '$arch'"; exit 1 ;; \
  esac

RUN apk --no-cache --force-overwrite --allow-untrusted add \
  /tmp/glibc.apk \
  /tmp/glibc-bin.apk

ARG PROJECT

# Don't run production as root
USER 1001 

WORKDIR /app

COPY --from=builder --chown=1001:1001 /app/apps/${PROJECT}/api .

ARG API_PORT=4000
ENV API_PORT=${API_PORT}

EXPOSE ${API_PORT}

CMD ["./api"]
