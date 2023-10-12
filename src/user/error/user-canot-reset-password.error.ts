import { BaseError } from '../../config/base.error';

export class UserCanNoResetPassword extends BaseError {
    constructor() {
        super(
            90,
            'The user can not reset password, please request the verification code first',
        );
    }
}
