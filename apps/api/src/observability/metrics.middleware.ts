import { Request, Response, NextFunction } from 'express';
import { Counter } from 'prom-client';
import { metricsRegistry } from './metrics.controller';

const httpRequestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['method', 'path', 'status'],
  registers: [metricsRegistry]
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      path: req.route?.path ?? req.path,
      status: res.statusCode
    });
  });
  next();
}
