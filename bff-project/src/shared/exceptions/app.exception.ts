import { HttpException, HttpStatus } from '@nestjs/common';

// Classe de base pour toutes les exceptions personnalisées de l'application
export class AppException extends HttpException {
  constructor(
    private errorCode: string,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        success: false,
        errorCode,
        message,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  // Retourne le code d'erreur spécifique à l'application
  getErrorCode(): string {
    return this.errorCode;
  }
}
