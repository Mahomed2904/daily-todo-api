import { BaseError } from '../../config/base.error';

export class AlreadyAbleToChangePasswordError extends BaseError {
    constructor() {
        super(98, 'You are already able to change password');
    }
}
