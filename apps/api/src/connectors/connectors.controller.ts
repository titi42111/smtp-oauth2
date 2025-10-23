import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectorsService } from './connectors.service';

@ApiTags('Connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get('inbound')
  inbound() {
    return this.connectorsService.listInbound();
  }

  @Get('outbound')
  outbound() {
    return this.connectorsService.listOutbound();
  }
}
