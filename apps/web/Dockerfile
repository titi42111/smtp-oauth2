FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/

RUN pnpm install --filter @smtp-oauth2/web... --config.child-concurrency=2 --config.network-concurrency=2

COPY . .

RUN pnpm --filter @smtp-oauth2/web build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "@smtp-oauth2/web", "start"]
