FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/web.yaml pnpm-workspace.yaml
COPY apps/web/package.json apps/web/

RUN pnpm install \
  --filter @smtp-oauth2/web... \
  --child-concurrency 1 \
  --network-concurrency 1 \
  --workspace-concurrency 1 \
  --max-store-concurrency 1

COPY . .

RUN pnpm --filter @smtp-oauth2/web build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "@smtp-oauth2/web", "start"]
