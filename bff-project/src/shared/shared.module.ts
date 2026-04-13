import { Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { HttpLoggingInterceptor } from './logger/http-logging.interceptor';

@Module({
  providers: [LoggerService, HttpLoggingInterceptor],
  exports: [LoggerService, HttpLoggingInterceptor],
})
export class SharedModule {}