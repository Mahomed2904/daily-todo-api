import { BaseError } from '../../config/base.error';

export class InvalidVerificationCodeError extends BaseError {
    constructor() {
        super(83, 'The verication code is invalid');
    }
}
