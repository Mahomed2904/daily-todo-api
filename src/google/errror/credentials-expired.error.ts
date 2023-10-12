import { BaseError } from '../../config/base.error';

export class CredentialsExpiredError extends BaseError {
    constructor() {
        super(11, 'Credentials are expired, credentials renew is needed');
    }
}
