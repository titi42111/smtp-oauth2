import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsService } from './connectors.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConnectorsController],
  providers: [ConnectorsService]
})
export class ConnectorsModule {}
