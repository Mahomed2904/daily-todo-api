import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CalendarService } from './google/calendar.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly calendarService: CalendarService,
    ) {}

    @Get()
    async getHello() {
        return 'Hello World';
    }

    @Get('callback')
    callback(): string {
        return 'Reveiced';
    }
}
