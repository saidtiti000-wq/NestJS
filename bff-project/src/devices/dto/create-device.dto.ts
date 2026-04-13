import { IsEnum, IsIP, IsNotEmpty, IsString } from 'class-validator';
import { DeviceStatus } from '../enums/device-status.enum';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  type: string;

  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  @IsIP()
  ip: string;

  @IsString()
  os: string;

  @IsString()
  lastSeen: string;
}