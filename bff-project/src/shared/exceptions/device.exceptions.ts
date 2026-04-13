import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class DeviceNotFoundException extends AppException {
  constructor(id?: string) {
    super(
      'DEVICE_NOT_FOUND',
      `Device ${id ? `with ID ${id}` : ''} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidDeviceStatusException extends AppException {
  constructor(status: string) {
    super(
      'INVALID_DEVICE_STATUS',
      `Invalid device status: ${status}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class DuplicateDeviceException extends AppException {
  constructor(field: string, value: string) {
    super(
      'DUPLICATE_DEVICE',
      `Device with ${field} "${value}" already exists`,
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidInputException extends AppException {
  constructor(message: string) {
    super(
      'INVALID_INPUT',
      message,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InternalServerException extends AppException {
  constructor(message: string = 'An unexpected error occurred') {
    super(
      'INTERNAL_SERVER_ERROR',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
