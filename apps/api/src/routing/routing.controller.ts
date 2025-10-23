import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoutingService } from './routing.service';

@ApiTags('Routing')
@Controller('routing-rules')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get()
  list() {
    return this.routingService.listRules();
  }
}
