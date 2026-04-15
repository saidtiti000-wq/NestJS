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
    // Injection du modèle Mongoose pour l'entité Device
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    // Injection du service de logs pour le suivi technique
    private readonly loggerService: LoggerService,
  ) {}

  // Récupère tous les documents de la collection devices
  async findAll(): Promise<Device[]> {
    this.loggerService.debug(this.constructor.name, 'Executing findAll query');
    const devices = await this.deviceModel.find().exec();
    this.loggerService.debug(this.constructor.name, `Found ${devices.length} devices`);
    return devices.map(d => d.toObject());
  }

  // Recherche un appareil spécifique par son ID MongoDB
  async findById(id: string): Promise<Device | null> {
    this.loggerService.debug(this.constructor.name, `Searching device by id: ${id}`);
    const device = await this.deviceModel.findById(id).exec();
    if (device) {
      // Si l'appareil est trouvé, on log le succès et on retourne l'objet
      this.loggerService.debug(this.constructor.name, `Device found: ${id}`);
      return device.toObject();
    } else {
      this.loggerService.debug(this.constructor.name, `Device not found: ${id}`);
      return null;
    }
  }

  // Recherche un appareil par son nom exact
  async findByName(name: string): Promise<Device | null> {
    const device = await this.deviceModel.findOne({ name }).exec();
    return device ? device.toObject() : null;
  }

  // Recherche un appareil par son adresse IP
  async findByIp(ip: string): Promise<Device | null> {
    const device = await this.deviceModel.findOne({ ip }).exec();
    return device ? device.toObject() : null;
  }

  // Insère un nouvel appareil dans la base de données
  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    this.loggerService.debug(this.constructor.name, 'Creating new device', {
      name: createDeviceDto.name,
      ip: createDeviceDto.ip,
    });
    const newDevice = new this.deviceModel({
      ...createDeviceDto,
      lastSeen: new Date().toISOString(),
    });
    const savedDevice = await newDevice.save();
    this.loggerService.debug(this.constructor.name, `Device created with id: ${savedDevice._id}`);
    return savedDevice.toObject();
  }

  // Met à jour les champs d'un appareil via son ID
  async update(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<Device | null> {
    const device = await this.deviceModel
      .findByIdAndUpdate(id, updateDeviceDto, { new: true })
      .exec();
    return device ? device.toObject() : null;
  }

  // Supprime un appareil de la collection
  async delete(id: string): Promise<Device | null> {
    this.loggerService.debug(this.constructor.name, `Deleting device: ${id}`);
    const device = await this.deviceModel.findByIdAndDelete(id).exec();
    if (device) {
      this.loggerService.debug(this.constructor.name, `Device deleted: ${id}`);
      return device.toObject();
    }
    return null;
  }

  // Retourne la liste des appareils ayant un statut spécifique
  async findByStatus(status: string): Promise<Device[]> {
    this.loggerService.debug(this.constructor.name, `Searching devices by status: ${status}`);
    const devices = await this.deviceModel.find({ status }).exec();
    this.loggerService.debug(this.constructor.name, `Found ${devices.length} devices with status: ${status}`);
    return devices.map(d => d.toObject());
  }

  // Calcule le nombre de documents total dans la collection
  async count(): Promise<number> {
    this.loggerService.debug(this.constructor.name, 'Counting devices');
    const count = await this.deviceModel.countDocuments().exec();
    this.loggerService.debug(this.constructor.name, `Total devices: ${count}`);
    return count;
  }


}
