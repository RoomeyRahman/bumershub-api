import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import {
  FilesService,
  AwsS3Service,
} from '../files/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property]),
  ],
  controllers: [PropertiesController],
  providers: [
    PropertiesService,
    FilesService,
    AwsS3Service,
  ]
})
export class PropertiesModule { }
