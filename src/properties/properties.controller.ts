import {
  HttpStatus,
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Put,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  NullValidationPipe,
  ValidationPipe,
  TrimPipe,
} from '../common/pipes';

/**
 * Properties Controller
 */
@ApiTags('Properties')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('properties')
export class PropertiesController {
  /**
   * Constructor
   * @param {PropertiesService} propertiesService
   */
  constructor(private readonly propertiesService: PropertiesService) { }

  /**
   * Create a record
   * @Body {CreatePropertyDto} data
   */
  @ApiOperation({ summary: 'Create a new record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new record.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  create(@Body() data: CreatePropertyDto) {
    try {
      return this.propertiesService.create(data);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * Fetchs records
   * @Param {string} query
   */
  @ApiOperation({ summary: 'Fetches records' })
  @ApiResponse({ status: 200, description: 'Returns list of records.' })
  @Get()
  findAll(@Query() query) {
    try {
      return this.propertiesService.findAll(query);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * Fetch a record by id 
   * @Param {string} id
   */
  @ApiOperation({ summary: 'Get a record by id' })
  @ApiResponse({ status: 200, description: 'Returns record.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record Not found.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.propertiesService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * update record
   * @param {UpdatePropertyDto} data
   */
  @ApiOperation({ summary: 'Update record' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return record' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdatePropertyDto) {
    try {
      return this.propertiesService.update(id, data);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * update record
   * @param {UpdatePropertyDto} data
   */
  @ApiOperation({ summary: 'Update record' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return record' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 4 },
  ]))
  @Put(':id')
  public async updatePut(
    @Param('id') id: string,
    @Body() data: UpdatePropertyDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
  ) {
    try {
      return await this.propertiesService.update(id, data, files);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * delete record
   * @param {string} id
   */
  @ApiOperation({ summary: 'delete record' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Delete record' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.propertiesService.remove(id);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }
}
