import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class ChangeCurrentPasswordGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (request.userType == 'EXTERNAL') {
            throw new HttpException(
                'This feature is not alowed to users who are logged using google account',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return true;
    }
}
