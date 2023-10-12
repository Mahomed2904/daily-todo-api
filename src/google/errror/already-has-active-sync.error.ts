import { BaseError } from '../../config/base.error';

export class AlreadyHasActiveSyncronizationError extends BaseError {
    constructor() {
        super(
            70,
            'Your already have any active asyncronization with google calendar',
        );
    }
}
