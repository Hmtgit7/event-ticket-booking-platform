FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@11.18.0 --activate
WORKDIR /app

# This Dockerfile is designed for Render's service-level Docker context:
# Docker Context Directory = services/notification-service
# Keep your current Dockerfile Path if Render already finds this file.
COPY package.json pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY nest-cli.json tsconfig.json tsconfig.build.json prisma.config.ts ./
COPY src ./src

RUN CI=true pnpm install --frozen-lockfile=false
RUN pnpm exec prisma generate
RUN pnpm run build
RUN pnpm prune --prod --ignore-scripts

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3003
CMD ["node", "dist/src/main"]
