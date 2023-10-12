import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class VerificationCodeGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isActivated = request.isActivated;
        if (request.userId && !isActivated) {
            throw new HttpException(
                'Your email account is not verified yet, please verify the email and try again',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return true;
    }
}
