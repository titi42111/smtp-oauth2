import { Controller, Get, Sse } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('logs')
export class LogsController {
  @Get()
  index() {
    return { message: 'Streaming logs non implémenté' };
  }

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return interval(5000).pipe(
      map(() => ({
        data: {
          level: 'info',
          message: 'Flux de logs non implémenté'
        }
      }))
    );
  }
}
