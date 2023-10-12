import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';

@Module({
    imports: [VerificationCodeModule, TypeOrmModule],
    exports: [TypeOrmModule],
})
export class ConfigModule {}
