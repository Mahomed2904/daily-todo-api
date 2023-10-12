import { Injectable } from '@nestjs/common';
import bcrypto from 'bcrypt';
import { InternalUser } from '../user/internal-user.entity';
import { CreateUserInputDTO } from '../user/dtos/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ExternalUser } from 'src/user/external-user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    areEqualPasswords(plain: string, hashed: string) {
        return bcrypto.compareSync(plain, hashed);
    }

    async createLocalUserToken(user: InternalUser) {
        const plainObject = {
            id: user.userId,
            isActivated: user.isActivated,
            email: user.email,
            userType: 'INTERNAL',
        };
        const token = await this.jwtService.signAsync(plainObject, {
            expiresIn: 604800,
        });
        const expiryDate = new Date().getTime() + 604800000;
        const payload = {
            isActivatedAccount: user.isActivated,
            acessToken: token,
            expiryDate: expiryDate.toString(),
            tokenType: 'Bearer',
        };
        return payload;
    }

    async createGoogleUserToken(extrnalUser: ExternalUser) {
        const plainObject = {
            id: extrnalUser.userId,
            email: extrnalUser.email,
            isActivated: true,
            userType: 'EXTERNAL',
        };
        const token = await this.jwtService.signAsync(plainObject, {
            expiresIn: 604800,
        });
        const expiryDate = new Date().getTime() + 604800000;
        const payload = {
            acessToken: token,
            expiryDate: expiryDate.toString(),
            tokenType: 'Bearer',
        };
        return payload;
    }

    mapUserAndHashPassword(userData: CreateUserInputDTO, user: InternalUser) {
        for (const propriety in userData) {
            user[propriety] = userData[propriety];
        }
        user.password = this.encriptPassword(userData.password);
    }

    encriptPassword(password: string) {
        return bcrypto.hashSync(password, 10);
    }
}
