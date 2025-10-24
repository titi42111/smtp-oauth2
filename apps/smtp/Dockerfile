FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/smtp.yaml pnpm-workspace.yaml
COPY apps/smtp/package.json apps/smtp/

RUN pnpm install \
  --filter @smtp-oauth2/smtp... \
  --config.child-concurrency=1 \
  --config.network-concurrency=1 \
  --config.workspace-concurrency=1 \
  --config.max-store-concurrency=1

COPY . .

RUN pnpm --filter @smtp-oauth2/smtp build

ENV NODE_ENV=production
EXPOSE 2525
CMD ["node", "apps/smtp/dist/index.js"]
