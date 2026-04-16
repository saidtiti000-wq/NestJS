import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
// Intercepteur pour journaliser toutes les requêtes HTTP entrantes et sortantes
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) { }

  // Intercepte la requête, calcule la durée et journalise le résultat
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        // Journalisation de l'appel HTTP avec les détails de performance
        this.loggerService.http('HttpInterceptor', method, path, statusCode, duration);
      }),
    );
  }
}
