#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { z } from 'zod';
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';

const program = new Command();
program
  .name('smtp-oauth2')
  .description("CLI d'administration pour la passerelle SMTP OAuth2")
  .version('0.1.0');

program
  .command('backup-db')
  .description('Effectuer une sauvegarde PostgreSQL via pg_dump')
  .requiredOption('-o, --output <file>', 'Fichier de sortie .sql')
  .action((options) => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL non défini');
    }
    const outputPath = options.output as string;
    execSync(`pg_dump --dbname="${databaseUrl}" --format=custom --file=${outputPath}`);
    // eslint-disable-next-line no-console
    console.log(`Sauvegarde écrite dans ${outputPath}`);
  });

const configSchema = z.object({
  inboundConnectors: z.array(z.unknown()),
  outboundConnectors: z.array(z.unknown()),
  routingRules: z.array(z.unknown()),
  users: z.array(z.object({ email: z.string().email(), role: z.string() }))
});

program
  .command('export-config')
  .description('Exporter la configuration (sans secrets)')
  .requiredOption('-o, --output <file>', 'Fichier JSON chiffré ou non')
  .action((options) => {
    const payload = {
      generatedAt: new Date().toISOString(),
      inboundConnectors: [],
      outboundConnectors: [],
      routingRules: [],
      users: []
    };
    writeFileSync(options.output, JSON.stringify(payload, null, 2), { encoding: 'utf8' });
    // eslint-disable-next-line no-console
    console.log(`Configuration exportée dans ${options.output}`);
  });

program
  .command('import-config')
  .description('Importer une configuration précédemment exportée')
  .requiredOption('-i, --input <file>', 'Fichier JSON')
  .action((options) => {
    const raw = readFileSync(options.input, { encoding: 'utf8' });
    const parsed = JSON.parse(raw);
    const validation = configSchema.safeParse(parsed);
    if (!validation.success) {
      throw new Error(`Configuration invalide: ${validation.error.message}`);
    }
    // eslint-disable-next-line no-console
    console.log('Import effectué (écriture en base non implémentée)');
  });

program.parseAsync().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
