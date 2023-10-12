import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDTO } from './dtos/create-user.dto';
import { AuthenticationInputDTO } from './dtos/authentication.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
    ChangeCurrentPasswordInputDTO,
    ChangePasswordInputDTO,
    RequestChhangePasswordInputDTO,
} from './dtos/change-password.dto';
import { UserAlreadyExistError } from './error/user-already-exist.error';
import { VerifyEmailDTO } from './dtos/verfy-email.dto';
import { VerificationCodeGuard } from '../verification-code/verification-code.guard';
import {
    GetUserDetailsInputDTO,
    UserDetailsInputDTO,
} from './dtos/user-details.dto';
import { VerifyPasswordDTO } from './dtos/verify-password.dto';
import { UserCanNoResetPassword } from './error/user-canot-reset-password.error';
import { AlreadyAbleToChangePasswordError } from './error/already-able-to-change-password.error';
import { ChangeCurrentPasswordGuard } from './change-current-password.guard';

@Controller('api/auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('authenticate')
    async authenticate(@Body() authData: AuthenticationInputDTO) {
        try {
            const output = await this.userService.authenticate(authData);
            return output;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error.message,
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Get('authenticate-google')
    async authenticateWithGoogle() {
        try {
            const output = await this.userService.autheticateWithGoogle();
            return output;
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: error.message,
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @Post('create-account')
    async createAccount(@Body() userData: CreateUserInputDTO) {
        try {
            const createdUser = await this.userService.createUser(userData);
            return createdUser;
        } catch (error) {
            throw new HttpException(
                {
                    status:
                        error instanceof UserAlreadyExistError
                            ? HttpStatus.CONFLICT
                            : HttpStatus.INTERNAL_SERVER_ERROR,
                    error: error.message,
                },
                error instanceof UserAlreadyExistError
                    ? HttpStatus.CONFLICT
                    : HttpStatus.INTERNAL_SERVER_ERROR,
                {
                    cause: error,
                },
            );
        }
    }

    @UseGuards(AuthGuard, VerificationCodeGuard)
    @Get('user-details')
    async userDetails(@Req() data: GetUserDetailsInputDTO) {
        return await this.userService.userDetails(data);
    }

    @UseGuards(AuthGuard, VerificationCodeGuard, ChangeCurrentPasswordGuard)
    @Post('configure-profile')
    async configureProfile(
        @Req() request: { userId: string },
        @Body() data: UserDetailsInputDTO,
    ) {
        return await this.userService.configureProfile(request.userId, data);
    }

    @UseGuards(AuthGuard, VerificationCodeGuard, ChangeCurrentPasswordGuard)
    @Post('change-current-password')
    async changeCurrentUserPassword(
        @Req() request: { userId: string },
        @Body() data: ChangeCurrentPasswordInputDTO,
    ) {
        try {
            await this.userService.changeAuthenticatedUserPassword(
                request.userId,
                data,
            );
            return {
                message: 'password changed sucessfull',
            };
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: error.message,
                },
                HttpStatus.FORBIDDEN,
                {
                    cause: error,
                },
            );
        }
    }

    @UseGuards(AuthGuard, ChangeCurrentPasswordGuard)
    @Get('request-email-verification-code')
    async requestEmailVerificationCode(@Req() request: { userId: string }) {
        return await this.userService.requestEmailVerificationCode(
            request.userId,
        );
    }

    @UseGuards(AuthGuard, ChangeCurrentPasswordGuard)
    @Post('verify-email')
    async verifyEmail(
        @Req() request: { userId: string },
        @Body() data: VerifyEmailDTO,
    ) {
        try {
            return await this.userService.verifyEmail(
                request.userId,
                data.code,
            );
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: error.message,
                },
                HttpStatus.BAD_REQUEST,
                {
                    cause: error,
                },
            );
        }
    }

    @Get('request-change-password-verification-code')
    async askChangeUserPasswordCode(
        @Body() data: RequestChhangePasswordInputDTO,
    ) {
        try {
            await this.userService.requestVerificationCodeForChangePassword(
                data,
            );
            return {
                message: `An email with the verification code was sent to you, Please verify your email to reset the password`,
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Post('verify-change-password-code')
    async enableChangePassword(@Body() data: VerifyPasswordDTO) {
        try {
            await this.userService.verifyChangePasswordCode(
                data.email,
                data.code,
            );
            return {
                message:
                    'Your code was verified sucessfull, now you can change your password',
            };
        } catch (error) {
            if (error instanceof AlreadyAbleToChangePasswordError) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            } else {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
        }
    }

    @Post('change-user-password')
    async changePassword(@Body() data: ChangePasswordInputDTO) {
        try {
            await this.userService.changePassword(data);
            return {
                message: 'Your password was changed sucessfull',
            };
        } catch (error) {
            if (error instanceof UserCanNoResetPassword) {
                throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
            } else {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
        }
    }

    @UseGuards(AuthGuard, VerificationCodeGuard)
    @Get('sync-with-calendar')
    async syncTodoWithGoogleCalendar(@Req() request: { userId: string }) {
        try {
            await this.userService.syncTodoWithGoogleCalendar(request.userId);
            return {
                message:
                    'The syncronization of your todos and your calendar was ativated sucessfull',
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(AuthGuard, VerificationCodeGuard)
    @Get('settings')
    async getSettings(@Req() request: { userId: string }) {
        return this.userService.getSettings(request.userId);
    }
}
