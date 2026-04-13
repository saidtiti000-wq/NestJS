import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema';
import { DevicesController } from './devices.controller';
import { DevicesService } from './device.service';
import { DeviceRepository } from './repositories/device.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    SharedModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DeviceRepository],
})
export class DevicesModule {}