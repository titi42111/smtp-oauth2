FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/smtp/package.json apps/smtp/
COPY packages/prisma/package.json packages/prisma/
COPY apps/api/package.json apps/api/
COPY packages/cli/package.json packages/cli/
COPY apps/worker/package.json apps/worker/
COPY apps/web/package.json apps/web/

RUN pnpm install --filter @smtp-oauth2/smtp --filter @smtp-oauth2/api --filter @smtp-oauth2/prisma --filter @smtp-oauth2/cli --filter @smtp-oauth2/worker --filter @smtp-oauth2/web --recursive --shamefully-hoist

COPY . .

RUN pnpm --filter @smtp-oauth2/smtp build

ENV NODE_ENV=production
EXPOSE 2525
CMD ["node", "apps/smtp/dist/index.js"]
