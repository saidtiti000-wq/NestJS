import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,

} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { ERROR_CODES, ERROR_MESSAGES } from '../exceptions/error.constants';

@Catch()
// Filtre global pour intercepter et formater toutes les exceptions de l'application
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) { }

  catch(exception: unknown, host: ArgumentsHost) {
    // Récupération du contexte HTTP (Request, Response)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse = {
      success: false,
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {

      status = exception.getStatus();
      const httpResponse = exception.getResponse();

      if (typeof httpResponse === 'object') {
        errorResponse = {
          ...errorResponse,
          ...(httpResponse as object),
        };
      } else {
        errorResponse.message = httpResponse as string;
      }
      this.loggerService.warn('GlobalExceptionFilter', `HTTP Exception: ${errorResponse.errorCode}`, {
        status,
        path: request.path,
        message: errorResponse.message,
      });
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
      this.loggerService.error(
        'GlobalExceptionFilter',
        'Unhandled exception',
        exception,
        {
          path: request.path,
          method: request.method,
        },
      );
    }

    response.status(status).json(errorResponse);
  }
}


