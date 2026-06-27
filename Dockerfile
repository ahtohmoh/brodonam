# ───────────────────────────────────────────────────────────────
# BRODONAM — production Docker image
# Multi-stage so the final image is lean and contains no toolchain.
# ───────────────────────────────────────────────────────────────

# Stage 1: build (native modules need a toolchain)
FROM node:20-bookworm-slim AS build
WORKDIR /app

# better-sqlite3 needs python + build-essential to compile its native binding
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: runtime
FROM node:20-bookworm-slim
WORKDIR /app

# Run as a non-root user
RUN useradd --create-home --shell /usr/sbin/nologin brodonam && \
    mkdir -p /app/data && chown -R brodonam:brodonam /app

COPY --from=build --chown=brodonam:brodonam /app/node_modules ./node_modules
COPY --chown=brodonam:brodonam . .

USER brodonam

ENV NODE_ENV=production
ENV PORT=3001
ENV BRODONAM_DB_PATH=/app/data/brodonam.db

EXPOSE 3001

# Healthcheck the API rather than the static page so an upstream LB sees real readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3001/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
