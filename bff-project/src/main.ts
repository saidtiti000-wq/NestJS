import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { HttpLoggingInterceptor } from './shared/logger/http-logging.interceptor';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:4200',
  });

  app.useGlobalInterceptors(new HttpLoggingInterceptor(loggerService));
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
bootstrap();

