import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DeviceStatus } from '../enums/device-status.enum';

// Type personnalisé pour représenter un document Device avec les fonctionnalités Mongoose
export type DeviceDocument = HydratedDocument<Device>;

// Options communes pour la transformation des objets (JSON et Object)
const commonSchemaOptions = {
  virtuals: true,
  versionKey: false,
  transform: (doc: any, ret: any) => {
    // Transforme l'identifiant MongoDB _id en id plus lisible
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

@Schema({
  // Utilise les options communes pour assurer la présence de l'ID et des virtuals
  toJSON: commonSchemaOptions,
  toObject: commonSchemaOptions,
})
export class Device {
  // Champ virtuel pour l'ID (optionnel dans le code mais présent en DB)
  id?: string;

  @Prop({ required: true })
  // Nom de l'appareil (ex: "Switch-01")
  name: string;

  @Prop({ required: true })
  // Modèle ou catégorie d'appareil
  type: string;

  @Prop({ required: true, enum: DeviceStatus, default: DeviceStatus.ONLINE })
  // Statut actuel de l'appareil
  status: DeviceStatus;

  @Prop({ required: true })
  // Adresse IP de l'appareil
  ip: string;

  @Prop({ required: true })
  // Système d'exploitation installé
  os: string;

  @Prop({ default: () => new Date().toISOString() })
  // Date de dernière activité enregistrée
  lastSeen: string;
}
// outil genere le shema mongoose a partir de la classe Device de type ts
export const DeviceSchema = SchemaFactory.createForClass(Device);
