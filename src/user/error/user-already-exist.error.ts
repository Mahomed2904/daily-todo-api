import { BaseError } from '../../config/base.error';

export class UserAlreadyExistError extends BaseError {
    constructor() {
        super(93, 'User with the same email already exists');
    }
}
