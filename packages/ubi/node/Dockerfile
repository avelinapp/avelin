ARG NODE_VERSION=20.18.3
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
RUN NODE_MAJOR_VERSION=${NODE_VERSION%%.*} && \
  curl -fsSL https://rpm.nodesource.com/setup_${NODE_MAJOR_VERSION}.x | bash - && \
  microdnf install -y nodejs-${NODE_VERSION} && \
  microdnf clean all

# Verify Node.js installation
RUN node -v && npm -v
