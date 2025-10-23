FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages/prisma/package.json packages/prisma/

RUN PRISMA_SKIP_GENERATE=1 pnpm install \
  --filter @smtp-oauth2/api... \
  --filter @smtp-oauth2/prisma... \
  --config.child-concurrency=2 \
  --config.network-concurrency=2 \
  --config.workspace-concurrency=1 \
  --config.max-store-concurrency=2

COPY . .

RUN pnpm --filter @smtp-oauth2/prisma generate
RUN pnpm --filter @smtp-oauth2/api build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
