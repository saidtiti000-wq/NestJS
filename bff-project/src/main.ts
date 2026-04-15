import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';
import { HttpLoggingInterceptor } from './shared/logger/http-logging.interceptor';
import { LoggerService } from './shared/logger/logger.service';

async function bootstrap() {
  // Création de l'application NestJS à partir du module racine
  const app = await NestFactory.create(AppModule);
  // Récupération des services pour la configuration et les logs
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  // Configuration du pipeline de validation global
  app.useGlobalPipes(
    new ValidationPipe({
      // Supprime les propriétés qui ne sont pas dans le DTO
      whitelist: true,
      // Empêche les propriétés non whitelistées d'être ajoutées à l'objet validé
      forbidNonWhitelisted: true,
      // Transforme les types primitifs automatiquement (ex: string -> number)
      transform: true,
    }),
  );

  // Activation de CORS avec configuration via variable d'environnement
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:4200',
  });

  // Installation globale de l'intercepteur de logs et du filtre d'exceptions
  app.useGlobalInterceptors(new HttpLoggingInterceptor(loggerService));
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  // Lancement du serveur sur le port configuré
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}
bootstrap();
