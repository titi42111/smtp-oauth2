FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/
COPY apps/api/package.json apps/api/
COPY apps/smtp/package.json apps/smtp/
COPY apps/web/package.json apps/web/
COPY packages/prisma/package.json packages/prisma/
COPY packages/cli/package.json packages/cli/

RUN pnpm install --filter @smtp-oauth2/worker --filter @smtp-oauth2/api --filter @smtp-oauth2/smtp --filter @smtp-oauth2/web --filter @smtp-oauth2/prisma --filter @smtp-oauth2/cli --recursive --shamefully-hoist

COPY . .

RUN pnpm --filter @smtp-oauth2/worker build

ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
