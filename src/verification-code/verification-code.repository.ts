import { Injectable } from '@nestjs/common';
import { VerificationCode } from './verification-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VerificationCodeRepository {
    constructor(
        @InjectRepository(VerificationCode)
        private emailVerificationRepository: Repository<VerificationCode>,
    ) {}

    save(emailVerification: VerificationCode) {
        return this.emailVerificationRepository.save(emailVerification);
    }

    findaAll() {
        return this.emailVerificationRepository.find();
    }

    findById(id: string): Promise<VerificationCode> {
        return this.emailVerificationRepository.findOne({
            where: {
                userId: id,
            },
        });
    }

    findByEmail(email: string): Promise<VerificationCode> {
        return this.emailVerificationRepository.findOne({
            where: {
                user: {
                    email: email,
                },
            },
        });
    }

    async delete(verificationCode: VerificationCode) {
        return await this.emailVerificationRepository.delete(
            verificationCode.userId,
        );
    }
}
