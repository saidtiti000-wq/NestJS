import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { HttpLoggingInterceptor } from './logger/http-logging.interceptor';

@Module({
  // Déclaration des services et intercepteurs partagés par toute l'application
  providers: [LoggerService, HttpLoggingInterceptor],
  // Exportation pour permettre l'injection dans d'autres modules (ex: DevicesModule)
  exports: [LoggerService, HttpLoggingInterceptor],
})
export class SharedModule {}