import { BaseError } from '../../config/base.error';

export class UserNotFoundError extends BaseError {
    constructor() {
        super(91, 'User not found error');
    }
}
