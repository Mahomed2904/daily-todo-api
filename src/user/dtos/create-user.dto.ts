import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthenticationOutputDTO } from './authentication.dto';

export class CreateUserInputDTO {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export interface UserCreatedDTO {
    userId: string;
    isActivated: boolean;
    authenticationData: AuthenticationOutputDTO;
}
