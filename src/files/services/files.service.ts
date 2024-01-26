import { Injectable, Logger } from '@nestjs/common';
import { AwsS3Service } from '../services';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  /**
   * Constructor
   * @param {service<AwsS3Service>} awsS3Service
   */
  constructor(
    private readonly awsS3Service: AwsS3Service,
  ) { }

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @param {ProviderDTO} providerDto
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File) {
    const AWS_BUCKET_FOLDER = process.env.AWS_S3_BUCKET_FOLDER;
    const response = {
      Location: '',
    };

    const awsLocation = await this.awsS3Service.uploadToS3(
      file,
      AWS_BUCKET_FOLDER,
    );
    response.Location = awsLocation.Location;
    return response;


  }
}
