import 'dotenv/config';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import pino from 'pino';

const logger = pino({ name: 'worker' });

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

const worker = new Worker(
  'outbound',
  async (job) => {
    logger.info({ id: job.id, name: job.name }, 'Traitement de job BullMQ (placeholder)');
    // TODO: implémenter l'appel à Microsoft Graph et la logique de réessai
  },
  {
    connection: redis
  }
);

worker.on('completed', (job) => {
  logger.info({ id: job.id }, 'Job terminé');
});

worker.on('failed', (job, err) => {
  logger.error({ id: job?.id, err }, 'Job échoué');
});

logger.info('Worker BullMQ initialisé');
