FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/smtp/package.json apps/smtp/

RUN pnpm install \
  --filter @smtp-oauth2/smtp... \
  --config.child-concurrency=2 \
  --config.network-concurrency=2 \
  --config.workspace-concurrency=1 \
  --config.max-store-concurrency=2

COPY . .

RUN pnpm --filter @smtp-oauth2/smtp build

ENV NODE_ENV=production
EXPOSE 2525
CMD ["node", "apps/smtp/dist/index.js"]
