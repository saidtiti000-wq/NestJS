import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DevicesService } from './device.service';
import { LoggerService } from '../shared/logger/logger.service';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  async findAll() {
    this.loggerService.log('DevicesController', 'Fetching all devices');
    return this.devicesService.findAll();
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    this.loggerService.log('DevicesController', `Fetching devices by status: ${status}`);
    return this.devicesService.findByStatus(status);
  }

  @Get('count')
  async getCount() {
    this.loggerService.log('DevicesController', 'Fetching device count');
    const count = await this.devicesService.getTotalDeviceCount();
    return { total: count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.loggerService.log('DevicesController', `Fetching device: ${id}`);
    return this.devicesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateDeviceDto) {
    this.loggerService.log('DevicesController', 'Creating new device', { name: dto.name });
    return this.devicesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    this.loggerService.log('DevicesController', `Updating device: ${id}`);
    return this.devicesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.loggerService.log('DevicesController', `Deleting device: ${id}`);
    return this.devicesService.remove(id);
  }
}