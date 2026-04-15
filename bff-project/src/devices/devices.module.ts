import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema';
import { DevicesController } from './devices.controller';
import { DevicesService } from './device.service';
import { DeviceRepository } from './repositories/device.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    // Configuration de Mongoose pour l'entité Device
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    // Importation du module partagé (Logger, etc.)
    SharedModule,
  ],
  controllers: [DevicesController],
  // Déclaration du service métier et de son repository
  providers: [DevicesService, DeviceRepository],
})
export class DevicesModule {}