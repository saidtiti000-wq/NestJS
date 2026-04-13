import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './repositories/device.repository';
import { DeviceNotFoundException } from '../shared/exceptions/device.exceptions';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class DevicesService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async findAll() {
    this.loggerService.log('DevicesService', 'Fetching all devices');
    try {
      const devices = await this.deviceRepository.findAll();
      this.loggerService.log('DevicesService', `Fetched ${devices.length} devices`);
      return devices;
    } catch (error) {
      this.loggerService.error('DevicesService', 'Failed to fetch all devices', error);
      throw error;
    }
  }

  async findOne(id: string) {
    this.loggerService.log('DevicesService', `Fetching device with id: ${id}`);
    try {
      const device = await this.deviceRepository.findById(id);

      if (!device) {
        this.loggerService.warn('DevicesService', `Device with id ${id} not found`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log('DevicesService', `Device with id ${id} fetched successfully`);
      return device;
    } catch (error) {
      if (error instanceof DeviceNotFoundException) throw error;
      this.loggerService.error('DevicesService', `Error fetching device with id ${id}`, error);
      throw error;
    }
  }

  async create(dto: CreateDeviceDto) {
    this.loggerService.log('DevicesService', 'Creating new device', { name: dto.name });
    try {
      const device = await this.deviceRepository.create(dto);
      this.loggerService.log('DevicesService', `Device created successfully with id: ${device._id}`);
      return device;
    } catch (error) {
      this.loggerService.error('DevicesService', 'Error creating device', error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateDeviceDto) {
    this.loggerService.log('DevicesService', `Updating device with id: ${id}`);
    try {
      const device = await this.deviceRepository.update(id, dto);

      if (!device) {
        this.loggerService.warn('DevicesService', `Device with id ${id} not found for update`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log('DevicesService', `Device with id ${id} updated successfully`);
      return device;
    } catch (error) {
      if (error instanceof DeviceNotFoundException) throw error;
      this.loggerService.error('DevicesService', `Error updating device with id ${id}`, error);
      throw error;
    }
  }

  async remove(id: string) {
    this.loggerService.log('DevicesService', `Deleting device with id: ${id}`);
    try {
      const result = await this.deviceRepository.delete(id);

      if (!result) {
        this.loggerService.warn('DevicesService', `Device with id ${id} not found for deletion`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log('DevicesService', `Device with id ${id} deleted successfully`);
      return { deleted: true };
    } catch (error) {
      if (error instanceof DeviceNotFoundException) throw error;
      this.loggerService.error('DevicesService', `Error deleting device with id ${id}`, error);
      throw error;
    }
  }

  async findByStatus(status: string) {
    this.loggerService.log('DevicesService', `Fetching devices with status: ${status}`);
    try {
      const devices = await this.deviceRepository.findByStatus(status);
      this.loggerService.log('DevicesService', `Fetched ${devices.length} devices with status: ${status}`);
      return devices;
    } catch (error) {
      this.loggerService.error('DevicesService', `Error fetching devices with status: ${status}`, error);
      throw error;
    }
  }

  async getTotalDeviceCount() {
    this.loggerService.log('DevicesService', 'Counting total devices');
    try {
      const count = await this.deviceRepository.count();
      this.loggerService.log('DevicesService', `Total device count: ${count}`);
      return count;
    } catch (error) {
      this.loggerService.error('DevicesService', 'Error counting devices', error);
      throw error;
    }
  }
}
