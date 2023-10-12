import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GoogleService } from './google.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarCredentials } from './calendar-credentials.entity';
import { CalendarCredentialsRepositrory } from './calendar-credentials.repository';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([CalendarCredentials])],
    providers: [CalendarService, GoogleService, CalendarCredentialsRepositrory],
    exports: [CalendarService, GoogleService],
})
export class GoogleModule {}
