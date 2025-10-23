import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutingService {
  constructor(private readonly prisma: PrismaService) {}

  listRules() {
    return this.prisma.routingRule.findMany({ orderBy: { priority: 'asc' } });
  }
}
