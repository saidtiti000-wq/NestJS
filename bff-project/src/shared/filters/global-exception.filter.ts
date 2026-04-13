import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse = {
      success: false,
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
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


