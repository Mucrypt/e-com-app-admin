# Multi-stage build with distroless base
FROM node:20-bullseye-slim AS base

WORKDIR /app

# Install dependencies for build
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --audit --fund=false --no-optional --ignore-scripts

# Builder stage
FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci --audit --fund=false --no-optional --ignore-scripts

COPY . .

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build && \
    npm prune --production

# Final stage - distroless
FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD ["node", "-e", "const http = require('http'); const req = http.request({hostname: 'localhost', port: 3000, path: '/api/health', timeout: 8000}, (res) => { res.statusCode === 200 ? process.exit(0) : process.exit(1); }); req.on('error', () => process.exit(1)); req.on('timeout', () => process.exit(1)); req.end();"]

CMD ["server.js"]