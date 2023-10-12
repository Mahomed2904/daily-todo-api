import { BaseError } from '../../config/base.error';

export class TodoNotFoundError extends BaseError {
    constructor() {
        super(12, 'Todo not found error');
    }
}
