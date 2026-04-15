import { IsEnum, IsIP, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceStatus } from '../enums/device-status.enum';

// Objet de transfert de données pour la création d'un appareil
export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  // Nom unique identifiant l'appareil
  name: string;

  @IsString()
  // Catégorie technique de l'appareil
  type: string;

  @IsEnum(DeviceStatus)
  // Statut initial (doit correspondre à l'énumération DeviceStatus)
  status: DeviceStatus;

  @IsIP()
  // Adresse IP valide (Format v4 ou v6)
  ip: string;

  @IsString()
  // Nom du système d'exploitation
  os: string;

  @IsString()
  @IsOptional()
  // Date de dernière vue (optionnelle à la création)
  lastSeen: string;
}