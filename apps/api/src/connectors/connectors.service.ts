import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConnectorsService {
  constructor(private readonly prisma: PrismaService) {}

  listInbound() {
    return this.prisma.inboundConnector.findMany({ orderBy: { name: 'asc' } });
  }

  listOutbound() {
    return this.prisma.outboundConnector.findMany({ orderBy: { name: 'asc' } });
  }
}
