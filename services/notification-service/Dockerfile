# Build context: repo root
# docker build -f services/notification-service/Dockerfile -t notification-service .

# ── Base ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS build

COPY . .

# Patch root prepare script — husky needs .git which doesn't exist in Docker
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

# pnpm deploy: creates isolated /prod/app with production deps + flat node_modules
RUN pnpm deploy --filter notification-service --prod --legacy /prod/app

# Copy compiled dist and prisma schema into the deploy folder
RUN cp -r services/notification-service/dist /prod/app/dist
RUN cp -r services/notification-service/prisma /prod/app/prisma
RUN cp    services/notification-service/prisma.config.ts /prod/app/prisma.config.ts

# Run prisma generate INSIDE /prod/app using the prisma CLI from the build stage
# This generates .prisma/client next to @prisma/client in the deploy's node_modules
# We temporarily rename prisma.config.ts so prisma doesn't try to load it
# (prisma/config module is not in prod deps)
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
