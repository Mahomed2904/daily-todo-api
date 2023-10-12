import { Module } from '@nestjs/common';
import { CodegeneratorService } from './codegenerator.service';

@Module({
    providers: [CodegeneratorService],
    exports: [CodegeneratorService],
})
export class CodegeneratorModule {}
