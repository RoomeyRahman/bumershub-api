import {
    Controller,
    Post,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ScrapService } from './scrap.service';

@Controller('scrap')
export class ScrapController {
    /**
     * Constructor
     * @param {ScrapService} service
     */
    constructor(private readonly service: ScrapService) { }

    @Post()
    Scrap() {
        try {
            return this.service.playwrightScrap();
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
    }

}
