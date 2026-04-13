import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DeviceStatus } from '../enums/device-status.enum';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, enum: DeviceStatus, default: DeviceStatus.ONLINE })
  status: DeviceStatus;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  os: string;

  @Prop({ default: () => new Date().toISOString() })
  lastSeen: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
