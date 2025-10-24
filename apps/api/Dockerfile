FROM node:20-bullseye
RUN apt-get update \
    && apt-get install -y --no-install-recommends libssl1.1 openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/api.yaml pnpm-workspace.yaml
COPY apps/api/package.json apps/api/
COPY packages/prisma/package.json packages/prisma/

ENV PNPM_WORKSPACE_CONCURRENCY=1 \
    PNPM_STORE_CONCURRENCY=1

RUN PRISMA_SKIP_GENERATE=1 pnpm install \
  --filter @smtp-oauth2/api... \
  --filter @smtp-oauth2/prisma... \
  --child-concurrency 1 \
  --network-concurrency 1

COPY . .

RUN pnpm --filter @smtp-oauth2/prisma generate
RUN pnpm --filter @smtp-oauth2/api build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
