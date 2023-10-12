import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticationInputDTO {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export interface AuthenticationOutputDTO {
    acessToken: string;
    tokenType: string;
    expiryDate: string;
}
