import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, path, query, body } = req;
    const startTime = Date.now();

    // Log requête entrante
    this.loggerService.log('HttpMiddleware', `Incoming ${method} request`, {
      path,
      query: Object.keys(query).length > 0 ? query : undefined,
    });

    // Intercepter la réponse
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Log réponse
      this.loggerService.http(
        'HttpMiddleware',
        method,
        path,
        statusCode,
        duration,
      );

      return originalSend.call(this, data);
    }.bind(this);

    next();
  }
}
