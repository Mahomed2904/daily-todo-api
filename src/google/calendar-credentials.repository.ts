import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarCredentials } from './calendar-credentials.entity';

@Injectable()
export class CalendarCredentialsRepositrory {
    constructor(
        @InjectRepository(CalendarCredentials)
        private calendarCredentialsRepository: Repository<CalendarCredentials>,
    ) {}

    async findAll(): Promise<CalendarCredentials[]> {
        const data = await this.calendarCredentialsRepository.find();
        return data;
    }

    async save(calendarCredentials: CalendarCredentials) {
        return await this.calendarCredentialsRepository.save(
            calendarCredentials,
        );
    }

    findById(id: string): Promise<CalendarCredentials> {
        return this.calendarCredentialsRepository.findOne({
            where: {
                userId: id,
            },
        });
    }
}
