import { IsEmail, IsString } from 'class-validator';

export class VerifyPasswordDTO {
    @IsEmail()
    email: string;

    @IsString()
    code: string;
}
