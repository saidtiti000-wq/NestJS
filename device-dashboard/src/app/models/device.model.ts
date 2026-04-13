export type DeviceStatus = 'online' | 'offline' | 'maintenance';

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  ip: string;
  os: string;
  lastSeen: string;
}