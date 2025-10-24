FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/worker.yaml pnpm-workspace.yaml
COPY apps/worker/package.json apps/worker/

RUN pnpm install \
  --filter @smtp-oauth2/worker... \
  --config.child-concurrency=1 \
  --config.network-concurrency=1 \
  --config.workspace-concurrency=1 \
  --config.max-store-concurrency=1

COPY . .

RUN pnpm --filter @smtp-oauth2/worker build

ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
