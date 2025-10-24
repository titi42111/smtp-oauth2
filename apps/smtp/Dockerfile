FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json turbo.json tsconfig.base.json ./
COPY docker/workspaces/smtp.yaml pnpm-workspace.yaml
COPY apps/smtp/package.json apps/smtp/

ENV PNPM_WORKSPACE_CONCURRENCY=1 \
    PNPM_STORE_CONCURRENCY=1

RUN pnpm install \
  --filter @smtp-oauth2/smtp... \
  --child-concurrency 1 \
  --network-concurrency 1

COPY . .

RUN pnpm --filter @smtp-oauth2/smtp build

ENV NODE_ENV=production
EXPOSE 2525
CMD ["node", "apps/smtp/dist/index.js"]
