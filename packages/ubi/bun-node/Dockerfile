ARG NODE_VERSION=20
ARG BUN_VERSION=1.1.43
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

