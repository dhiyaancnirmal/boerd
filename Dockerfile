FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /app/packages /app/apps
COPY package.json bun.lockb ./
COPY packages/storage ./packages/storage
COPY packages/database ./packages/database
COPY apps/web/package.json ./apps/web/

RUN bun install --frozen-lockfile

# Build storage package
FROM install AS build-storage
WORKDIR /app/packages/storage
COPY packages/storage ./
RUN bun run build

# Build web app
FROM install AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=build-storage /app/packages/storage/dist /app/packages/storage/dist
COPY packages/database ./packages/database
COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN bun run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public

# Create data directory for SQLite and uploads
RUN mkdir -p /app/data/uploads/images/{original,thumbnails} /app/data/uploads/files
RUN chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV DATA_DIR=/app/data

CMD ["node", "server.js"]
