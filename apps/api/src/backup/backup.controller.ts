import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BackupService } from './backup.service';

@ApiTags('Backup')
@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('export')
  export() {
    return this.backupService.exportConfiguration();
  }

  @Post('import')
  import(@Body() _payload: unknown) {
    return this.backupService.importConfiguration();
  }
}
