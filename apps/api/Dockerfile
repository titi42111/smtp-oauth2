FROM node:20-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY apps/smtp/package.json apps/smtp/
COPY apps/worker/package.json apps/worker/
COPY apps/web/package.json apps/web/
COPY packages/prisma/package.json packages/prisma/
COPY packages/cli/package.json packages/cli/

RUN pnpm install --filter @smtp-oauth2/api --filter @smtp-oauth2/prisma --filter @smtp-oauth2/cli --filter @smtp-oauth2/smtp --filter @smtp-oauth2/worker --filter @smtp-oauth2/web --recursive --shamefully-hoist

COPY . .

RUN pnpm --filter @smtp-oauth2/api build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
