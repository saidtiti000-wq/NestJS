import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevicesModule } from './devices/devices.module';
import { SharedModule } from './shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Configuration globale des variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Connexion asynchrone à la base de données MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    // Importation des modules fonctionnels
    DevicesModule,
    // Importation du module transverse (Logger, Filtres, etc.)
    SharedModule,
  ],
})
export class AppModule {}