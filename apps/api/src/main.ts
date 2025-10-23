import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';
import { metricsMiddleware } from './observability/metrics.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());
  app.use(csurf({ cookie: true, ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }));
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true }));
  app.use(metricsMiddleware);

  const config = new DocumentBuilder()
    .setTitle('SMTP to Microsoft Graph API')
    .setDescription('API pour la passerelle SMTP OAuth2 mono-tenant')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json'
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('API bootstrap failed', error);
  process.exitCode = 1;
});
