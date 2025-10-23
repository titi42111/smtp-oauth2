import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoutingController],
  providers: [RoutingService]
})
export class RoutingModule {}
