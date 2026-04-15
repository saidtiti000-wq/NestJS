export const ERROR_CODES = {
  // Erreurs liées aux appareils
  DEVICE_NOT_FOUND: 'DEVICE_NOT_FOUND',
  INVALID_DEVICE_STATUS: 'INVALID_DEVICE_STATUS',
  DUPLICATE_DEVICE: 'DUPLICATE_DEVICE',

  // Erreurs de validation de données
  INVALID_INPUT: 'INVALID_INPUT',

  // Erreurs système générales
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export const ERROR_MESSAGES = {
  DEVICE_NOT_FOUND: 'The requested device could not be found',
  INVALID_DEVICE_STATUS: 'The provided device status is invalid',
  DUPLICATE_DEVICE: 'A device with this identifier already exists',
  INVALID_INPUT: 'The provided input is invalid',
  INTERNAL_SERVER_ERROR: 'An unexpected server error occurred',
};
