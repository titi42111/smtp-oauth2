import {
  SMTPServer,
  type SMTPServerAuthentication,
  type SMTPServerAuthenticationResponse,
  type SMTPServerSession
} from 'smtp-server';
import { simpleParser, type ParsedMail } from 'mailparser';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import pino from 'pino';
import 'dotenv/config';

const logger = pino({ name: 'smtp' });

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
const queue = new Queue('outbound', { connection: redis });

const server = new SMTPServer({
  authOptional: false,
  disabledCommands: ['STARTTLS'],
  onAuth(
    auth: SMTPServerAuthentication,
    session: SMTPServerSession,
    callback: (err: Error | null, response?: SMTPServerAuthenticationResponse) => void
  ) {
    if (!process.env.SMTP_ACCEPT_ALL) {
      return callback(new Error('Auth non implémentée'));
    }
    logger.info({ username: auth.username }, 'auth accepté (mode démo)');
    callback(null, { user: { username: auth.username } });
  },
  async onData(stream: NodeJS.ReadableStream, session: SMTPServerSession, callback: (err?: Error | null) => void) {
    try {
      const parsed: ParsedMail = await simpleParser(stream);
      await queue.add('deliver', {
        envelope: session.envelope,
        subject: parsed.subject,
        text: parsed.text,
        html: parsed.html
      });
      logger.info({ envelope: session.envelope }, 'Message ajouté à la file');
      callback();
    } catch (error) {
      logger.error({ error }, 'Echec de traitement du message');
      callback(error as Error);
    }
  }
});

const port = Number(process.env.SMTP_PORT || 2525);
server.listen(port, process.env.SMTP_HOST || '0.0.0.0', () => {
  logger.info({ port }, 'Serveur SMTP écoute');
});
