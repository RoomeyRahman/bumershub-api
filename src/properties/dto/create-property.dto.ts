import { PartialType } from '@nestjs/swagger';
import { PropertyDto } from './property.dto';

export class CreatePropertyDto extends PartialType(PropertyDto) { }

