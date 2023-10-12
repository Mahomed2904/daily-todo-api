import { IsEmail, IsString } from 'class-validator';

export class ChangeCurrentPasswordInputDTO {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}

export class RequestChhangePasswordInputDTO {
    @IsEmail()
    email: string;
}

export class ChangePasswordInputDTO {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}
