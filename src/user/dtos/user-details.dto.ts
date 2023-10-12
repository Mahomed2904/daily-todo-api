import { IsObject, IsPhoneNumber, IsString } from 'class-validator';
import { Credentials } from 'google-auth-library';

export class UserDetails {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    profilePhoto: string;

    constructor({ id, email, name, phoneNumber, profilePhoto }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.profilePhoto = profilePhoto;
    }
}

export class UserDetailsInputDTO {
    @IsString()
    name: string;

    @IsPhoneNumber('MZ')
    phoneNumber: string;

    profilePhoto: string | undefined;
}

export class GetUserDetailsInputDTO {
    @IsObject()
    credentials: Credentials;

    @IsString()
    userId: string;

    @IsString()
    userType: string;
}
