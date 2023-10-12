import { Injectable } from '@nestjs/common';
import { InternalUser } from './internal-user.entity';
import { CreateUserInputDTO, UserCreatedDTO } from './dtos/create-user.dto';
import {
    AuthenticationInputDTO,
    AuthenticationOutputDTO,
} from './dtos/authentication.dto';
import { InternalUserRepository } from './internal-user.repository';
import { AuthService } from '../auth/auth.service';
import { InvalidEmailOrPasswordError } from './error/invalid-email-or-password.error';
import { FilterParams, FilterParamsDTO } from './dtos/list-user.dto';
import { UserAlreadyExistError } from './error/user-already-exist.error';
import {
    GetUserDetailsInputDTO,
    UserDetails as UserDetailsDTO,
    UserDetailsInputDTO,
} from './dtos/user-details.dto';
import { UserDetails as UserDetailsEntity } from './user-details.entity';
import {
    ChangeCurrentPasswordInputDTO,
    ChangePasswordInputDTO,
    RequestChhangePasswordInputDTO,
} from './dtos/change-password.dto';
import { UserNotFoundError } from './error/user-not-found.error';
import { InvalidOldPasswordError } from './error/invalid-old-password.error';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import { EmailAlreadyVerifiedError } from 'src/verification-code/errors/email-already-verified.error';
import { InvalidVerificationCodeError } from 'src/verification-code/errors/invalid-verification-code.error';
import { UserDetailsRepository } from './user-details.repository';
import { UserCanNoResetPassword } from './error/user-canot-reset-password.error';
import { AlreadyAbleToChangePasswordError } from './error/already-able-to-change-password.error';
import { GoogleService } from 'src/google/google.service';
import { ExternalUserRepository } from './external-user.repository';
import { ExternalUser } from './external-user.entity';
import { UserRepository } from './user.repository';
import { Credentials } from 'google-auth-library';
import { CalendarService } from 'src/google/calendar.service';

@Injectable()
export class UserService {
    constructor(
        private internalUserRepository: InternalUserRepository,
        private externalUserRepository: ExternalUserRepository,
        private userRepository: UserRepository,
        private userDetailsRepository: UserDetailsRepository,
        private readonly authService: AuthService,
        private readonly verificationCodeService: VerificationCodeService,
        private readonly googleService: GoogleService,
        private readonly calendarService: CalendarService,
    ) {}

    public async authenticate(
        authData: AuthenticationInputDTO,
    ): Promise<AuthenticationOutputDTO> {
        const user = await this.internalUserRepository.findByEmail(
            authData.email,
        );
        if (!user) {
            throw new InvalidEmailOrPasswordError();
        }
        const areEqualPasswords = this.authService.areEqualPasswords(
            authData.password,
            user.password,
        );
        if (!areEqualPasswords) {
            throw new InvalidEmailOrPasswordError();
        }
        return await this.authService.createLocalUserToken(user);
    }

    public async autheticateWithGoogle() {
        const payload = await this.googleService.autheticateUser();
        const existingUser = await this.externalUserRepository.findByEmail(
            payload.email,
        );
        const user = new ExternalUser();
        if (existingUser) {
            user.userId = existingUser.userId;
        }
        user.email = payload.email;
        user.accessToken = payload.credentials.access_token;
        user.idToken = payload.credentials.id_token;
        user.scope = payload.credentials.scope;
        user.expiryDate = payload.credentials.expiry_date;
        user.refreshToken = payload.credentials.refresh_token;
        const savedUser = await this.externalUserRepository.save(user);
        return await this.authService.createGoogleUserToken(savedUser);
    }

    public async createUser(
        userData: CreateUserInputDTO,
    ): Promise<UserCreatedDTO> {
        const doesUserAlreadyExist =
            await this.internalUserRepository.findByEmail(userData.email);
        if (doesUserAlreadyExist) {
            throw new UserAlreadyExistError();
        }
        const user = new InternalUser();
        this.authService.mapUserAndHashPassword(userData, user);
        const savedUser = await this.internalUserRepository.save(user);
        await this.verificationCodeService.createAndSendEmailVerificationCode(
            savedUser,
        );
        const authenticationData =
            await this.authService.createLocalUserToken(user);
        return {
            userId: user.userId,
            isActivated: user.isActivated,
            authenticationData: authenticationData,
        };
    }

    public async requestEmailVerificationCode(userId: string) {
        const user = await this.internalUserRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        await this.verificationCodeService.createAndSendEmailVerificationCode(
            user,
        );
        return {
            message:
                'An email with the verification code was sent to you, Please verify your email to reset the password',
        };
    }

    async verifyEmail(userId: string, code: string) {
        const user = await this.internalUserRepository.findById(userId);
        if (user.isActivated) {
            throw new EmailAlreadyVerifiedError();
        }
        const isValidVerificationCode =
            await this.verificationCodeService.validadeVerificationCode(
                user.id,
                code,
            );
        if (!isValidVerificationCode) {
            throw new InvalidVerificationCodeError();
        }
        user.isActivated = true;
        const savedUser = await this.internalUserRepository.save(user);
        return await this.authService.createLocalUserToken(savedUser);
    }

    public findAll(params: FilterParamsDTO) {
        const filterParams = new FilterParams(params);
        return this.internalUserRepository.findAll(filterParams);
    }

    public async userDetails({
        userId,
        userType,
    }: GetUserDetailsInputDTO): Promise<UserDetailsDTO> {
        if (userType == 'INTERNAL') {
            const user = await this.internalUserRepository.findById(userId);
            if (!user) {
                throw new UserNotFoundError();
            }
            const userDetails = await this.userDetailsRepository.findById(
                user.id,
            );
            return new UserDetailsDTO({
                id: user.userId,
                email: user.email,
                name: userDetails?.name,
                phoneNumber: userDetails?.phoneNumber,
                profilePhoto: userDetails?.profilePhoto,
            });
        } else {
            const user = await this.externalUserRepository.findById(userId);
            const credentials: Credentials = {
                access_token: user.accessToken,
                expiry_date: user.expiryDate,
                id_token: user.idToken,
                refresh_token: user.refreshToken,
                scope: user.scope,
                token_type: user.tokenType,
            };
            const userData = await this.googleService.userProfile(credentials);
            return new UserDetailsDTO({
                id: undefined,
                email: userData.email,
                name: userData.name,
                phoneNumber: undefined,
                profilePhoto: userData.picture,
            });
        }
    }

    public async configureProfile(
        userId: string,
        userDetailsDTO: UserDetailsInputDTO,
    ): Promise<UserDetailsDTO> {
        const user = await this.internalUserRepository.findById(userId);
        const userDetails = new UserDetailsEntity();
        userDetails.name = userDetailsDTO.name;
        userDetails.phoneNumber = userDetailsDTO.phoneNumber;
        userDetails.profilePhoto = userDetailsDTO.profilePhoto;
        userDetails.user = user;
        userDetails.userId = user.userId;
        const savedUserDetails =
            await this.userDetailsRepository.save(userDetails);
        return new UserDetailsDTO({
            id: user.userId,
            email: user.email,
            name: savedUserDetails?.name,
            phoneNumber: savedUserDetails?.phoneNumber,
            profilePhoto: savedUserDetails?.profilePhoto,
        });
    }

    public async changeAuthenticatedUserPassword(
        id: string,
        data: ChangeCurrentPasswordInputDTO,
    ): Promise<boolean> {
        const user = await this.internalUserRepository.findById(id);
        if (!user) {
            throw new UserNotFoundError();
        }
        const areEqualPasswords = this.authService.areEqualPasswords(
            data.oldPassword,
            user.password,
        );
        if (!areEqualPasswords) {
            throw new InvalidOldPasswordError();
        }
        user.password = this.authService.encriptPassword(data.newPassword);
        await this.internalUserRepository.save(user);
        return true;
    }

    public async requestVerificationCodeForChangePassword(
        data: RequestChhangePasswordInputDTO,
    ) {
        const user = await this.internalUserRepository.findByEmail(data.email);
        if (!user) {
            throw new UserNotFoundError();
        }
        await this.verificationCodeService.createAndSendPasswordResetVerificationCode(
            user,
        );
    }

    public async verifyChangePasswordCode(email: string, code: string) {
        const user = await this.internalUserRepository.findByEmail(email);
        if (user.resetPassword) {
            throw new AlreadyAbleToChangePasswordError();
        }
        const isValidVerificationCode =
            await this.verificationCodeService.validadeVerificationCode(
                email,
                code,
            );
        if (!isValidVerificationCode) {
            throw new InvalidVerificationCodeError();
        }
        user.resetPassword = true;
        await this.internalUserRepository.save(user);
    }

    public async changePassword(data: ChangePasswordInputDTO) {
        const user = await this.internalUserRepository.findByEmail(data.email);
        if (!user) {
            throw new UserNotFoundError();
        }
        if (!user.resetPassword) {
            throw new UserCanNoResetPassword();
        }
        user.password = this.authService.encriptPassword(data.password);
        user.resetPassword = false;
        await this.internalUserRepository.save(user);
        await this.verificationCodeService.removeVerificationCode(user);
    }

    public async syncTodoWithGoogleCalendar(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        await this.calendarService.authorize(user);
    }

    public async getSettings(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const data = await this.calendarService.isAuthorized(user);
        return {
            authrized: data,
        };
    }
}
