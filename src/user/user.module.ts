import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalUser } from './internal-user.entity';
import { ConfigModule } from 'src/config/config.module';
import { AuthService } from '../auth/auth.service';
import { InternalUserRepository } from './internal-user.repository';
import { AuthModule } from '../auth/auth.module';
import { CodegeneratorModule } from '../codegenerator/codegenerator.module';
import { EmailModule } from '../email/email.module';
import { UserDetails } from './user-details.entity';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { UserDetailsRepository } from './user-details.repository';
import { GoogleModule } from 'src/google/calendar.module';
import { User } from './user.entity';
import { ExternalUser } from './external-user.entity';
import { ExternalUserRepository } from './external-user.repository';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        AuthModule,
        ConfigModule,
        CodegeneratorModule,
        EmailModule,
        VerificationCodeModule,
        GoogleModule,
        TypeOrmModule.forFeature([
            User,
            InternalUser,
            ExternalUser,
            UserDetails,
        ]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        AuthService,
        InternalUserRepository,
        UserDetailsRepository,
        ExternalUserRepository,
        UserRepository,
    ],
    exports: [TypeOrmModule, UserRepository],
})
export class UserModule {}
