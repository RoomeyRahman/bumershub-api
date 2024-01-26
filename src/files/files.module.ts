import { Module } from '@nestjs/common';
import { AwsS3Controller } from './controllers';
import { AwsS3Service } from './services';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';

@Module({
  controllers: [AwsS3Controller, FilesController],
  providers: [
    AwsS3Service,
    FilesService,
  ],
})
export class FilesModule {}
