import { HttpException, HttpStatus } from '@nestjs/common';

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

  getErrorCode(): string {
    return this.errorCode;
  }
}
