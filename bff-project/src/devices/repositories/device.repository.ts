import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from '../schemas/device.schema';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';

import { LoggerService } from '../../shared/logger/logger.service';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  async findAll(): Promise<DeviceDocument[]> {
    this.loggerService.debug('DeviceRepository', 'Executing findAll query');
    const devices = await this.deviceModel.find().exec();
    this.loggerService.debug('DeviceRepository', `Found ${devices.length} devices`);
    return devices;
  }

  async findById(id: string): Promise<DeviceDocument | null> {
    this.loggerService.debug('DeviceRepository', `Searching device by id: ${id}`);
    const device = await this.deviceModel.findById(id).exec();
    if (device) {
      this.loggerService.debug('DeviceRepository', `Device found: ${id}`);
    } else {
      this.loggerService.debug('DeviceRepository', `Device not found: ${id}`);
    }
    return device;
  }

  async findByName(name: string): Promise<DeviceDocument | null> {
    return this.deviceModel.findOne({ name }).exec();
  }

  async findByIp(ip: string): Promise<DeviceDocument | null> {
    return this.deviceModel.findOne({ ip }).exec();
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<DeviceDocument> {
    this.loggerService.debug('DeviceRepository', 'Creating new device', {
      name: createDeviceDto.name,
      ip: createDeviceDto.ip,
    });
    const newDevice = new this.deviceModel({
      ...createDeviceDto,
      lastSeen: new Date().toISOString(),
    });
    const savedDevice = await newDevice.save();
    this.loggerService.debug('DeviceRepository', `Device created with id: ${savedDevice._id}`);
    return savedDevice;
  }

  async update(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceDocument | null> {
    return this.deviceModel
      .findByIdAndUpdate(id, updateDeviceDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<DeviceDocument | null> {
    this.loggerService.debug('DeviceRepository', `Deleting device: ${id}`);
    const device = await this.deviceModel.findByIdAndDelete(id).exec();
    if (device) {
      this.loggerService.debug('DeviceRepository', `Device deleted: ${id}`);
    }
    return device;
  }

  async findByStatus(status: string): Promise<DeviceDocument[]> {
    this.loggerService.debug('DeviceRepository', `Searching devices by status: ${status}`);
    const devices = await this.deviceModel.find({ status }).exec();
    this.loggerService.debug('DeviceRepository', `Found ${devices.length} devices with status: ${status}`);
    return devices;
  }

  async count(): Promise<number> {
    this.loggerService.debug('DeviceRepository', 'Counting devices');
    const count = await this.deviceModel.countDocuments().exec();
    this.loggerService.debug('DeviceRepository', `Total devices: ${count}`);
    return count;
  }
}
