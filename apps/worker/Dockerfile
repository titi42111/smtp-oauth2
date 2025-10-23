FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/

RUN pnpm install --filter @smtp-oauth2/worker... --config.child-concurrency=2 --config.network-concurrency=2

COPY . .

RUN pnpm --filter @smtp-oauth2/worker build

ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
