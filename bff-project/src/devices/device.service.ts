import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceRepository } from './repositories/device.repository';
import {
  DeviceNotFoundException,
  InvalidDeviceStatusException,
  DuplicateDeviceException,
} from '../shared/exceptions/device.exceptions';
import { DeviceStatus } from './enums/device-status.enum';
import { LoggerService } from '../shared/logger/logger.service';

@Injectable()
export class DevicesService {
  constructor(
    // Injection du repository pour l'accès aux données des appareils
    private readonly deviceRepository: DeviceRepository,
    // Injection du service de logs pour la traçabilité
    private readonly loggerService: LoggerService,
  ) {}

  // Récupère la liste de tous les appareils enregistrés
  async findAll() {
    this.loggerService.log(this.constructor.name, 'Fetching all devices');
    try {
      const devices = await this.deviceRepository.findAll();
      this.loggerService.log(this.constructor.name, `Fetched ${devices.length} devices`);
      return devices;
    } catch (error) {
      this.loggerService.error(this.constructor.name, 'Failed to fetch all devices', error);
      throw error;
    }
  }

  // Récupère un appareil spécifique par son identifiant unique
  async findOne(id: string) {
    this.loggerService.log(this.constructor.name, `Fetching device with id: ${id}`);
    try {
      const device = await this.deviceRepository.findById(id);

      if (!device) {
        this.loggerService.warn(this.constructor.name, `Device with id ${id} not found`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log(this.constructor.name, `Device with id ${id} fetched successfully`);
      return device;
    } catch (error) {
      if (error instanceof DeviceNotFoundException) throw error;
      this.loggerService.error(this.constructor.name, `Error fetching device with id ${id}`, error);
      throw error;
    }
  }

  // Crée un nouvel appareil après vérification des doublons (Nom et IP)
  async create(dto: CreateDeviceDto) {
    this.loggerService.log(this.constructor.name, 'Creating new device', { name: dto.name });

    // Check for existing device with same name
    const existingName = await this.deviceRepository.findByName(dto.name);
    if (existingName) {
      throw new DuplicateDeviceException('name', dto.name);
    }

    // Check for existing device with same IP
    const existingIp = await this.deviceRepository.findByIp(dto.ip);
    if (existingIp) {
      throw new DuplicateDeviceException('ip', dto.ip);
    }

    try {
      const device = await this.deviceRepository.create(dto);
      this.loggerService.log(this.constructor.name, `Device created successfully with id: ${device.id}`);
      return device;
    } catch (error) {
      this.loggerService.error(this.constructor.name, 'Error creating device', error);
      throw error;
    }
  }

  // Met à jour les informations d'un appareil existant
  async update(id: string, dto: UpdateDeviceDto) {
    this.loggerService.log(this.constructor.name, `Updating device with id: ${id}`);

    // Vérifie les doublons si le nom est modifié
    if (dto.name) {
      const existingName = await this.deviceRepository.findByName(dto.name);
      if (existingName && String(existingName.id) !== String(id)) {
        throw new DuplicateDeviceException('name', dto.name);
      }
    }

    // Check for duplicates if IP is being updated
    if (dto.ip) {
      const existingIp = await this.deviceRepository.findByIp(dto.ip);
      if (existingIp && String(existingIp.id) !== String(id)) {
        throw new DuplicateDeviceException('ip', dto.ip);
      }
    }

    try {
      const device = await this.deviceRepository.update(id, dto);

      if (!device) {
        this.loggerService.warn(this.constructor.name, `Device with id ${id} not found for update`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log(this.constructor.name, `Device with id ${id} and ${JSON.stringify(dto)} updated successfully`);
      return device;
    } catch (error) {
      if (error instanceof DeviceNotFoundException || error instanceof DuplicateDeviceException) throw error;
      this.loggerService.error(this.constructor.name, `Error updating device with id ${id}`, error);
      throw error;
    }
  }

  // Supprime un appareil de la base de données par son ID
  async remove(id: string) {
    this.loggerService.log(this.constructor.name, `Deleting device with id: ${id}`);
    try {
      const result = await this.deviceRepository.delete(id);

      if (!result) {
        this.loggerService.warn(this.constructor.name, `Device with id ${id} not found for deletion`);
        throw new DeviceNotFoundException(id);
      }

      this.loggerService.log(this.constructor.name, `Device with id ${id} deleted successfully`);
      return { deleted: true };
    } catch (error) {
      if (error instanceof DeviceNotFoundException) throw error;
      this.loggerService.error(this.constructor.name, `Error deleting device with id ${id}`, error);
      throw error;
    }
  }

  // Filtre et retourne les appareils selon leur statut (ONLINE, OFFLINE, etc.)
  async findByStatus(status: string) {
    this.loggerService.log(this.constructor.name, `Fetching devices with status: ${status}`);

    // Validate status parameter
    if (!Object.values(DeviceStatus).includes(status as DeviceStatus)) {
      throw new InvalidDeviceStatusException(status);
    }

    try {
      const devices = await this.deviceRepository.findByStatus(status);
      this.loggerService.log(this.constructor.name, `Fetched ${devices.length} devices with status: ${status}`);
      return devices;
    } catch (error) {
      if (error instanceof InvalidDeviceStatusException) throw error;
      this.loggerService.error(this.constructor.name, `Error fetching devices with status: ${status}`, error);
      throw error;
    }
  }

  // Retourne le nombre total d'appareils présents dans le système
  async getTotalDeviceCount() {
    this.loggerService.log(this.constructor.name, 'Counting total devices');
    try {
      const count = await this.deviceRepository.count();
      this.loggerService.log(this.constructor.name, `Total device count: ${count}`);
      return count;
    } catch (error) {
      this.loggerService.error(this.constructor.name, 'Error counting devices', error);
      throw error;
    }
  }
}
