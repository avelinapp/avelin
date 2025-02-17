ARG NODE_VERSION=20
ARG UBI9_VERSION=9.5

#######

# =========================
# Stage 1: Builder
# =========================
FROM redhat/ubi9-minimal:${UBI9_VERSION} AS ubi

ARG NODE_VERSION

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
