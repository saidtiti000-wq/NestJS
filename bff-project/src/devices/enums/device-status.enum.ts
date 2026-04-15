// Énumération des différents états possibles d'un appareil
export enum DeviceStatus {
  // Actif et connecté au réseau
  ONLINE = 'online',
  // Inactif ou non joignable
  OFFLINE = 'offline',
  // En cours de réparation ou de mise à jour
  MAINTENANCE = 'maintenance',
}