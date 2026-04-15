import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES, ERROR_MESSAGES } from './error.constants';


// Erreur lancée lorsqu'un appareil n'est pas trouvé dans la base de données
export class DeviceNotFoundException extends AppException {
  constructor(id?: string) {
    super(
      ERROR_CODES.DEVICE_NOT_FOUND,
      id ? `Device with ID ${id} not found` : ERROR_MESSAGES.DEVICE_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }
}

// Erreur lancée lorsque le statut d'un appareil n'est pas une valeur autorisée
export class InvalidDeviceStatusException extends AppException {
  constructor(status: string) {
    super(
      ERROR_CODES.INVALID_DEVICE_STATUS,
      `${ERROR_MESSAGES.INVALID_DEVICE_STATUS}: ${status}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

// Erreur lancée lors d'une tentative de création d'un appareil déjà existant (Nom ou IP)
export class DuplicateDeviceException extends AppException {
  constructor(field: string, value: string) {
    super(
      ERROR_CODES.DUPLICATE_DEVICE,
      `Device with ${field} "${value}" already exists`,
      HttpStatus.CONFLICT,
    );
  }
}
