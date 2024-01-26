import { Entity, Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/entities';

@Entity({ name: 'property' })
export class Property extends BaseEntity {
    @Column({ unique: true, type: 'varchar', length: 300 })
    @IsNotEmpty()
    name: string;

    @Column({ type: 'varchar', length: 1000 })
    @IsNotEmpty()
    address: string;

    @Column({ type: 'varchar', length: 1000 })
    @IsNotEmpty()
    city: string;

    @Column({ type: 'varchar', length: 1000 })
    @IsNotEmpty()
    state: string;

    @Column({ type: 'varchar', length: 1000 })
    @IsNotEmpty()
    country: string;

    @Column({ type: 'varchar', length: 10 })
    @IsNotEmpty()
    zipcode: string;

    @Column({ nullable: true, type: 'float' })
    lat: number;

    @Column({ nullable: true, type: 'float' })
    lng: number;

    @Column({ type: 'varchar', length: 15 })
    phone: string;

    @Column({ type: 'float' })
    capacity: number;

    @Column('simple-array', { nullable: true })  
    files: string[];
}
