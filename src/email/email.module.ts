import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CodegeneratorModule } from '../codegenerator/codegenerator.module';

@Module({
    imports: [CodegeneratorModule],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
