FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/worker.yaml pnpm-workspace.yaml
COPY apps/worker/package.json apps/worker/

ENV PNPM_WORKSPACE_CONCURRENCY=1 \
    PNPM_STORE_CONCURRENCY=1

RUN pnpm install \
  --filter @smtp-oauth2/worker... \
  --child-concurrency 1 \
  --network-concurrency 1

COPY . .

RUN pnpm --filter @smtp-oauth2/worker build

ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
