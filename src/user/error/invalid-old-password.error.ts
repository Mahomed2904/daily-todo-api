import { BaseError } from '../../config/base.error';

export class InvalidOldPasswordError extends BaseError {
    constructor() {
        super(86, 'The old password is invalid');
    }
}
