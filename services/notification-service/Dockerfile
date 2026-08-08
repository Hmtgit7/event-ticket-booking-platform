# ─────────────────────────────────────────────────────────────────────────────
# Build context: REPO ROOT  (set "Docker Context Directory" to "." on Render)
# Render > Service Settings > Build & Deploy > Docker Context Directory = .
# Dockerfile Path = services/notification-service/Dockerfile
# ─────────────────────────────────────────────────────────────────────────────

# ── Base ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS build

# Copy repo root files first (lockfile lives here)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy only the service source (keeps context transfer small)
COPY services/notification-service ./services/notification-service

# Patch root prepare script — husky fails without .git in Docker
RUN node -e "\
  const f='package.json', p=JSON.parse(require('fs').readFileSync(f));\
  p.scripts.prepare='echo skip';\
  require('fs').writeFileSync(f, JSON.stringify(p, null, 2));"

# Install all workspace deps (dev + prod — prisma CLI is a devDep)
RUN CI=true pnpm install --frozen-lockfile

# Generate Prisma client (needed for TypeScript compilation)
RUN pnpm --filter notification-service exec prisma generate

# Build NestJS
RUN pnpm --filter notification-service run build

# pnpm deploy: isolated /prod/app with production deps only
RUN pnpm deploy --filter notification-service --prod --legacy /prod/app

# Copy compiled dist + prisma into the deploy folder
RUN cp -r services/notification-service/dist /prod/app/dist
RUN cp -r services/notification-service/prisma /prod/app/prisma
RUN cp    services/notification-service/prisma.config.ts /prod/app/prisma.config.ts

# Re-run prisma generate inside /prod/app so .prisma/client is populated
# Temporarily hide prisma.config.ts (it imports prisma/config which is a devDep)
RUN cd /prod/app && \
    mv prisma.config.ts prisma.config.ts.bak && \
    node /app/node_modules/.pnpm/prisma@*/node_modules/prisma/build/index.js generate \
      --schema prisma/schema.prisma && \
    mv prisma.config.ts.bak prisma.config.ts

# ── Production image ──────────────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /prod/app .

EXPOSE 3003
ENTRYPOINT ["node", "dist/src/main"]
