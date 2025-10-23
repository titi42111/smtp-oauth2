declare module 'smtp-server' {
  import { EventEmitter } from 'events';

  export interface SMTPServerEnvelopeAddress {
    address: string | false;
    args?: Record<string, unknown>;
  }

  export interface SMTPServerEnvelope {
    mailFrom: SMTPServerEnvelopeAddress;
    rcptTo: SMTPServerEnvelopeAddress[];
  }

  export interface SMTPServerSession {
    id: string;
    envelope: SMTPServerEnvelope;
    [key: string]: unknown;
  }

  export interface SMTPServerAuthentication {
    method: string;
    username: string;
    password: string;
    [key: string]: unknown;
  }

  export interface SMTPServerAuthenticationResponse {
    user: unknown;
  }

  export type SMTPServerAuthCallback = (
    err: Error | null,
    response?: SMTPServerAuthenticationResponse
  ) => void;

  export type SMTPServerDataCallback = (err?: Error | null) => void;

  export interface SMTPServerOptions {
    authOptional?: boolean;
    disabledCommands?: string[];
    onAuth?: (
      auth: SMTPServerAuthentication,
      session: SMTPServerSession,
      callback: SMTPServerAuthCallback
    ) => void;
    onData?: (
      stream: NodeJS.ReadableStream,
      session: SMTPServerSession,
      callback: SMTPServerDataCallback
    ) => void;
  }

  export class SMTPServer extends EventEmitter {
    constructor(options?: SMTPServerOptions);
    listen(port: number, host?: string, callback?: () => void): void;
    close(callback?: () => void): void;
  }
}
