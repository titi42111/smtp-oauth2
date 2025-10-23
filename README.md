# Passerelle SMTP OAuth2 (monorepo pnpm)

Ce dépôt propose la fondation technique d'une solution on-premise convertissant des flux SMTP authentifiés en appels Microsoft Graph. Il s'agit d'un monorepo PNPM structuré autour de services Node.js/NestJS et d'une interface Next.js. L'objectif est d'étendre progressivement ces bases vers un produit complet répondant aux exigences décrites dans le cahier des charges.

## Sommaire

1. [Architecture d'ensemble](#architecture-densemble)
2. [Prérequis](#prérequis)
3. [Installation locale](#installation-locale)
4. [Développement avec pnpm workspaces](#développement-avec-pnpm-workspaces)
5. [Conteneurisation & déploiement](#conteneurisation--déploiement)
6. [Base de données & Prisma](#base-de-données--prisma)
7. [Scripts CLI sauvegarde/export](#scripts-cli-sauvegardeexport)
8. [Configuration Microsoft Graph](#configuration-microsoft-graph)
9. [Observabilité & sécurité](#observabilité--sécurité)
10. [Roadmap fonctionnelle](#roadmap-fonctionnelle)

## Architecture d'ensemble

Le monorepo s'articule autour des éléments suivants :

- **apps/api** : API NestJS (JWT, RBAC, Prisma) exposant la gestion des utilisateurs, connecteurs, règles et sauvegardes.
- **apps/smtp** : serveur SMTP Node.js basé sur `smtp-server`, parse les messages et les place dans BullMQ.
- **apps/worker** : worker BullMQ responsable de la conversion vers Microsoft Graph (implémentation à enrichir).
- **apps/web** : interface Next.js 14 (App Router) avec Tailwind + shadcn/ui pour l'administration.
- **packages/prisma** : schéma Prisma (PostgreSQL) couvrant les entités mono-tenant (users, connecteurs, routing rules, messages, audit, settings) + script de seed.
- **packages/cli** : CLI Node.js (commander) fournissant sauvegarde PostgreSQL et export/import de configuration.

L'orchestration conteneurisée est assurée via `docker-compose.yml` avec les services : API, SMTP, worker, web, PostgreSQL, Redis et Traefik (reverse-proxy TLS).

## Prérequis

- Node.js 20+ (Corepack activé pour PNPM)
- PNPM 8 (`corepack enable pnpm`)
- Docker & Docker Compose (déploiement local ou on-prem)
- PostgreSQL 15+/Redis 7 si exécutés hors Docker

## Installation locale

```bash
corepack enable pnpm
pnpm install
pnpm run build
```

Pour initialiser la base de données en local :

```bash
pnpm --filter @smtp-oauth2/prisma migrate:dev
pnpm --filter @smtp-oauth2/prisma seed
```

Lancement simultané (API, UI, SMTP, worker) :

```bash
pnpm dev
```

Chaque application peut aussi être démarrée individuellement :

```bash
pnpm --filter @smtp-oauth2/api dev
pnpm --filter @smtp-oauth2/web dev
pnpm --filter @smtp-oauth2/smtp dev
pnpm --filter @smtp-oauth2/worker dev
```

## Développement avec pnpm workspaces

Le fichier `pnpm-workspace.yaml` expose les workspaces `apps/*` et `packages/*`. `turbo` est configuré pour orchestrer les pipelines `dev`, `build`, `lint`, `test`. Les scripts clés :

- `pnpm build` : build de tous les packages (NestJS, Next.js, services)
- `pnpm test` : placeholder pour les suites Jest/Supertest/k6 (à implémenter)
- `pnpm format` : formatage global avec Prettier

## Conteneurisation & déploiement

Un fichier [`docker-compose.yml`](./docker-compose.yml) est fourni pour un déploiement rapide on-prem :

- `certs` (job éphémère : génère un certificat auto-signé si les fichiers attendus sont absents)
- `postgres` (volume `postgres-data`)
- `redis`
- `api`, `smtp`, `worker`, `web` (images construites via leurs Dockerfiles respectifs)
- `traefik` (reverse proxy TLS, ports 80/443)

Variables d'environnement : voir [`.env.example`](./.env.example). Les secrets (`MASTER_KEY`, `JWT_SECRET`, `AZURE_*`, `TLS_*`) seront initialisés depuis l'interface d'administration (fonctionnalité en cours) : il n'est donc plus nécessaire de préparer des Docker secrets au démarrage.

Le service `certs` monte le volume partagé `traefik-certs` et invoque `openssl` pour produire `server.crt`/`server.key` (ainsi qu'un `ca.pem` identique) lorsque les fichiers sont absents. Ajustez `TLS_SELF_SIGNED_SUBJECT` et `TLS_SELF_SIGNED_DAYS` pour personnaliser le certificat, ou prémontez vos propres fichiers afin que Traefik et les services SMTP/API les réutilisent.

Les Dockerfiles des services Node.js exécutent `pnpm install` avec une concurrence réduite (`--config.workspace-concurrency=1`, `--config.child-concurrency=2`) afin d'éviter les dépassements mémoire lors de la construction sur des hôtes limités. Vous pouvez augmenter ces valeurs si votre environnement dispose de ressources plus confortables.

Commande type :

```bash
cp .env.example .env
# Modifier les variables nécessaires
docker compose up -d --build
```

## Base de données & Prisma

Le schéma Prisma couvre l'ensemble des entités mono-tenant (Settings, Users, Inbound/OutboundConnector, RoutingRule, Message, AuditLog). La commande `pnpm --filter @smtp-oauth2/prisma migrate:dev` génère les migrations. Le script `packages/prisma/prisma/seed.ts` crée un administrateur par défaut (`admin@local` / `ChangeMe!123`).

Pour effectuer un déploiement en production :

```bash
pnpm --filter @smtp-oauth2/prisma migrate:deploy
pnpm --filter @smtp-oauth2/prisma seed
```

## Scripts CLI sauvegarde/export

Le package `@smtp-oauth2/cli` expose la commande `smtp-oauth2` (nécessite build préalable) :

```bash
pnpm --filter @smtp-oauth2/cli build
node packages/cli/dist/index.js backup-db --output backups/backup_$(date +%F).dump
node packages/cli/dist/index.js export-config --output backups/config.json
node packages/cli/dist/index.js import-config --input backups/config.json
```

L'import/export est volontairement minimaliste et ne manipule pas encore les secrets : les structures JSON sont prêtes pour extension.

## Configuration Microsoft Graph

Pour connecter l'application au tenant Azure AD du client :

1. Créer une application Azure AD (single-tenant) avec les autorisations **Mail.Send** (Application et/ou Delegated).
2. Récupérer `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`. L'autorité recommandée est `https://login.microsoftonline.com/<tenantId>`.
3. Définir les scopes `GRAPH_SCOPES` selon le mode souhaité (`https://graph.microsoft.com/.default` couvre Application ; ajouter `Mail.Send` pour Delegated).
4. Renseigner ces valeurs via l'interface d'administration (planifiée) ou, à défaut, dans un `.env` local pour le développement. Le worker BullMQ consommera ces paramètres pour appeler Microsoft Graph (implémentation à compléter).

## Observabilité & sécurité

- **Swagger/OpenAPI** : disponible via `/docs` sur l'API NestJS.
- **Prometheus** : endpoint `/api/metrics` exposant les métriques par défaut via `prom-client`.
- **Healthchecks** : `/healthz` et `/readyz` vérifient l'accès à PostgreSQL et exposent un horodatage ISO.
- **Sécurité HTTP** : Helmet, CSRF (cookie), JSON Web Tokens, placeholders pour RBAC/MFA.
- **Journalisation** : Pino (JSON). Les messages SMTP ne sont pas stockés dans les logs (métadonnées uniquement) et une vue dédiée exposera les envois/réceptions/échecs dans l'interface web.

## Roadmap fonctionnelle

Cette base technique pose les jalons suivants pour les itérations à venir :

- Implémentation complète des flux Auth (MFA TOTP, refresh tokens, SSO Microsoft 365 pour l'interface d'administration et la gestion des connecteurs).
- Gestion CRUD avancée des connecteurs entrants/sortants + tests de connectivité.
- Orchestration BullMQ (retry/backoff, rate limit, monitoring) et conversion MIME → Graph.
- StartTLS obligatoire côté serveur SMTP avec prise en charge d'une autorité interne.
- Interface Next.js : tableaux de bord, simulateur complet, mode air-gap, localisation FR/EN.
- Observabilité enrichie : OpenTelemetry, streaming logs SSE, dashboards Prometheus.
- Gestion centralisée des journaux d'envoi/réception/échec (vue UI + export).
- Scripts de sauvegarde/restauration chiffrés, politiques de rotation des secrets.
- Documentation on-premise détaillée (procédures d'upgrade, scénarios proxy, air-gap, exemples swaks/k6).

Les contributions futures pourront s'appuyer sur cette structure homogène (pnpm workspace, Turbo, Docker multi-stage) pour implémenter progressivement l'intégralité du cahier des charges.
