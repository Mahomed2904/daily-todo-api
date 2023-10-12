import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { PhotoModule } from './photo/photo.module';
import { AppService } from './app.service';
import { config } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { CodegeneratorService } from './codegenerator/codegenerator.service';
import { CodegeneratorModule } from './codegenerator/codegenerator.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { GoogleModule } from './google/calendar.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(config.getTypeOrmConfig()),
        TodoModule,
        UserModule,
        PhotoModule,
        AuthModule,
        EmailModule,
        CodegeneratorModule,
        GoogleModule,
        VerificationCodeModule,
    ],
    controllers: [AppController],
    providers: [AppService, CodegeneratorService],
})
export class AppModule {}
