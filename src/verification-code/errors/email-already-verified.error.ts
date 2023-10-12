import { BaseError } from '../../config/base.error';

export class EmailAlreadyVerifiedError extends BaseError {
    constructor() {
        super(81, 'The email is already verified');
    }
}
