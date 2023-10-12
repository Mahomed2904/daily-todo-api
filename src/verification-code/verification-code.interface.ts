import { InternalUser } from '../user/internal-user.entity';

export interface VerificationCodeOutput {
    message: string;
}

export interface VerificationCodeInput {
    email: string;
    user: InternalUser;
}
