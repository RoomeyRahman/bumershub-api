import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesService } from '../files/services';

@Injectable()
export class PropertiesService {
  /**
   * Constructor
   * @param {Repository<Property>} repo
   * @param {FilesService} filesService
   */
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
    private readonly filesService: FilesService,
  ) { }

  /**
   * Create record
   * @param {CreatePropertyDto} data
   * @returns record
   */
  async create(data: CreatePropertyDto) {
    try {
      return await this.repo.save(data);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * fetch records
   * @param {Object} query
   * @returns record[]
   */
  async findAll(query) {
    try {
      const queryParam = query && query?.filter ? JSON.parse(query.filter) : {};
      console.log(queryParam)
      if (queryParam && queryParam.name) {
        queryParam.name = Like(`%${queryParam.name}%`)
      }
      if (queryParam && queryParam.state) {
        queryParam.state = Like(`%${queryParam.state}%`)
      }
      if (queryParam && queryParam.city) {
        queryParam.city = Like(`%${queryParam.city}%`)
      }
      return await this.repo.find({
        where: queryParam
      })
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * fetch record by id
   * @param {string} id
   * @returns record[]
   */
  async findOne(id: string) {
    try {
      const record = await this.repo.findOne({
        where: {
          id: id,
        },
      });

      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      return record;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Update record
   * @param {string} id
   * @param {UpdatePropertyDto} data
   */
  async update(
    id: string,
    data: UpdatePropertyDto,
    files?: {
      images?: Express.Multer.File[];
    }) {
    try {
      const record = await this.repo.findOne({
        where: {
          id: id,
        },
      });

      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      const fileUrls = record.files || [];
      if (files) {
        if (files && files.images) {
          const images = await Promise.all(
            files.images.map(async (image) => {
              const uploadRes = await this.filesService.upload(image);
              fileUrls.push(uploadRes.Location);
            }),
          );
        }
      }
      if (fileUrls && fileUrls.length > 0) {
        data.files = fileUrls
      }


      return await this.repo.save({
        ...record,
        ...data,
        updatedAt: Date.now()
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete record by id
   * @param {string} id
   * @returns 
   */
  async remove(id: string) {
    try {
      return await this.repo.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
