import { BaseError } from '../../config/base.error';

export class AuthorizationNotGivenError extends BaseError {
    constructor() {
        super(
            71,
            'Authorization not given error, please allow sync with you google drive',
        );
    }
}
