import { IsUUID, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PropertyDto implements Readonly<PropertyDto> {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @MaxLength(300)
    name: string;

    @ApiProperty()
    @MaxLength(1000)
    address: string;

    @ApiProperty()
    @MaxLength(1000)
    city: string;

    @ApiProperty()
    @MaxLength(1000)
    state: string;

    @ApiProperty()
    @MaxLength(1000)
    country: string;

    @ApiProperty()
    @MaxLength(10)
    zipcode: string;

    @ApiProperty()
    @MaxLength(15)
    phone: string;

    @ApiProperty()
    capacity: number;

    @ApiProperty()
    files: string[];

    @ApiProperty()
    lat: number;

    @ApiProperty()
    lng: number;
}
