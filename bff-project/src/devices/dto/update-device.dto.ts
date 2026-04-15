import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';

// Objet de transfert de données pour la mise à jour partielle d'un appareil
// Hérite de CreateDeviceDto mais rend tous les champs optionnels grâce à PartialType
export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
