import { BaseError } from '../../config/base.error';

export class InvalidEmailOrPasswordError extends BaseError {
    constructor() {
        super(98, 'Invalid email or password error');
    }
}
