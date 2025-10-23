import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { LogsController } from './logs.controller';

@Module({
  controllers: [MetricsController, LogsController]
})
export class ObservabilityModule {}
