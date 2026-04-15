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
    // Injection du service métier pour la gestion des appareils
    private readonly devicesService: DevicesService,
    // Injection du service de logs pour la traçabilité des requêtes
    private readonly loggerService: LoggerService,
  ) {}

  // Endpoint GET pour récupérer tous les appareils
  @Get()
  async findAll() {
    this.loggerService.log(this.constructor.name, 'Fetching all devices');
    return this.devicesService.findAll();
  }

  // Endpoint GET pour filtrer les appareils par statut
  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    this.loggerService.log(this.constructor.name, `Fetching devices by status: ${status}`);
    return this.devicesService.findByStatus(status);
  }

  // Endpoint GET pour obtenir le décompte total des appareils
  @Get('count')
  async getCount() {
    this.loggerService.log(this.constructor.name, 'Fetching device count');
    const count = await this.devicesService.getTotalDeviceCount();
    return { total: count };
  }

  // Endpoint GET pour récupérer un appareil par son ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.loggerService.log(this.constructor.name, `Fetching device: ${id}`);
    return this.devicesService.findOne(id);
  }

  // Endpoint POST pour la création d'un nouvel appareil
  @Post()
  async create(@Body() dto: CreateDeviceDto) {
    this.loggerService.log(this.constructor.name, 'Creating new device', { name: dto.name });
    return this.devicesService.create(dto);
  }

  // Endpoint PATCH pour modifier partiellement un appareil
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    this.loggerService.log(this.constructor.name, `Updating device: ${id}`);
    return this.devicesService.update(id, dto);
  }

  // Endpoint DELETE pour supprimer un appareil
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.loggerService.log(this.constructor.name, `Deleting device: ${id}`);
    return this.devicesService.remove(id);
  }
}