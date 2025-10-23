import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CheckResult = { status: 'ok' } | { status: 'error'; error: string };

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  private async checkDatabase(): Promise<CheckResult> {
    try {
      await this.prisma.$queryRawUnsafe('SELECT 1');
      return { status: 'ok' };
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  private async buildResponse(): Promise<{
    status: 'ok' | 'error';
    checks: { database: CheckResult };
    timestamp: string;
  }> {
    const database = await this.checkDatabase();
    return {
      status: database.status === 'ok' ? 'ok' : 'error',
      checks: { database },
      timestamp: new Date().toISOString()
    };
  }

  @Get('/healthz')
  async healthz() {
    return this.buildResponse();
  }

  @Get('/readyz')
  async readyz() {
    return this.buildResponse();
  }
}
