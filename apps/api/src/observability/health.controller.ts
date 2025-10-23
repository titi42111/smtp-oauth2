import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get('/healthz')
  @HealthCheck()
  healthz() {
    return this.health.check([]);
  }

  @Get('/readyz')
  @HealthCheck()
  readyz() {
    return this.health.check([]);
  }
}
