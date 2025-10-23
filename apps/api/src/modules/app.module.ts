import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma/prisma.module';
import { ObservabilityModule } from '../observability/observability.module';
import { HealthModule } from '../observability/health.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConnectorsModule } from '../connectors/connectors.module';
import { RoutingModule } from '../routing/routing.module';
import { MessagesModule } from '../messages/messages.module';
import { BackupModule } from '../backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TerminusModule,
    PrismaModule,
    ObservabilityModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ConnectorsModule,
    RoutingModule,
    MessagesModule,
    BackupModule
  ]
})
export class AppModule {}
