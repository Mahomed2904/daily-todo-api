import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationCodeRepository } from './verification-code.repository';
import { VerificationCode } from './verification-code.entity';
import { CodegeneratorService } from 'src/codegenerator/codegenerator.service';
import { EmailService } from '../email/email.service';
import { InternalUser } from '../user/internal-user.entity';
import { InvalidVerificationCodeError } from './errors/invalid-verification-code.error';

@Injectable()
export class VerificationCodeService {
    constructor(
        private readonly verificationCodeRepository: VerificationCodeRepository,
        private readonly codeGeneretorService: CodegeneratorService,
        private readonly emailService: EmailService,
    ) {
        this.activateAutoDeleteForCodes();
    }

    public async checkVerification(userId: string): Promise<boolean> {
        const emailVerification =
            await this.verificationCodeRepository.findById(userId);
        return emailVerification.user.isActivated;
    }

    public async validadeVerificationCode(
        userId: string,
        code: string,
    ): Promise<boolean> {
        const emailVerification =
            await this.verificationCodeRepository.findById(userId);
        if (!emailVerification) {
            throw new InvalidVerificationCodeError();
        }
        return code === emailVerification.code;
    }

    public async createAndSendEmailVerificationCode(
        user: InternalUser,
    ): Promise<string> {
        console.log('Ola');
        const verificationCode = await this.createVerificationCodeAndSave(user);
        await this.emailService.sendVerificationCodeEmailTo(
            user.email,
            verificationCode.code,
        );
        return verificationCode.code;
    }

    public async createAndSendPasswordResetVerificationCode(
        user: InternalUser,
    ): Promise<string> {
        const verificationCode = await this.createVerificationCodeAndSave(user);
        await this.emailService.sendResetPasswordVerificationCode(
            user.email,
            verificationCode.code,
        );
        return verificationCode.code;
    }

    public async removeVerificationCode(user: InternalUser) {
        const verificationCode = await this.verificationCodeRepository.findById(
            user.userId,
        );
        if (!verificationCode) {
            throw new NotFoundException();
        }
        await this.verificationCodeRepository.delete(verificationCode);
        return true;
    }

    public async activateAutoDeleteForCodes() {
        const verificationCodes =
            await this.verificationCodeRepository.findaAll();
        for (const vericationCode of verificationCodes) {
            const now = Date.now();
            let time = vericationCode.createdAt.getTime() + 1800000 - now;
            time = time > 0 ? time : 1;
            setTimeout(() => {
                this.verificationCodeRepository.delete(vericationCode);
            }, time);
        }
    }

    private async createVerificationCodeAndSave(user: InternalUser) {
        const emailVerification = new VerificationCode();
        const code = this.codeGeneretorService.generateCode();
        emailVerification.code = code;
        emailVerification.userId = user.userId;
        emailVerification.user = user;
        const verificationCode =
            await this.verificationCodeRepository.save(emailVerification);
        setTimeout(() => this.removeVerificationCode(user), 3000000);
        return verificationCode;
    }
}
