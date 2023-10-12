import { Module } from '@nestjs/common';
import { VerificationCodeService } from './verification-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './verification-code.entity';
import { CodegeneratorModule } from 'src/codegenerator/codegenerator.module';
import { VerificationCodeRepository } from './verification-code.repository';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        CodegeneratorModule,
        EmailModule,
        TypeOrmModule.forFeature([VerificationCode]),
    ],
    providers: [VerificationCodeRepository, VerificationCodeService],
    exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
