ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.43
ARG PROJECT=api
ARG PACKAGE=@avelin/${PROJECT}
ARG UBI9_VERSION=9.5

#######

# =========================
# Stage 1: Builder
# =========================
FROM redhat/ubi9-minimal:${UBI9_VERSION} AS ubi

ARG NODE_VERSION \
  BUN_VERSION

# -------------------------
# Environment Variables
# -------------------------
ENV BUN_INSTALL=/root/.bun
ENV PATH=$BUN_INSTALL/bin:$PATH

# -------------------------
# Install Dependencies
# -------------------------
RUN microdnf install -y libgcc libstdc++ unzip && \
  microdnf clean all

# -------------------------
# Install Node.js
# -------------------------
RUN curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
  microdnf install -y nodejs && \
  microdnf clean all

# Verify Node.js installation
RUN node -v && npm -v

# -------------------------
# Install Bun
# -------------------------
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}" && \
  ln -s $BUN_INSTALL/bin/bun /usr/local/bin/bun

# Verify Bun installation
RUN bun -v

#######

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
