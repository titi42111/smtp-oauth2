declare module 'mailparser' {
  export interface AttachmentLike {
    filename?: string;
    contentType?: string;
    size?: number;
  }

  export interface ParsedMail {
    subject?: string;
    text?: string | null;
    html?: string | null;
    attachments?: AttachmentLike[];
    [key: string]: unknown;
  }

  export function simpleParser(
    source: NodeJS.ReadableStream | Buffer | string,
    options?: Record<string, unknown>
  ): Promise<ParsedMail>;
}
