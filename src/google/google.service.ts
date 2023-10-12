import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client, Credentials } from 'google-auth-library';

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

@Injectable()
export class GoogleService {
    constructor() {}
    private async authorize() {
        const clientCredentials = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        return clientCredentials;
    }

    private async getProfileData(auth: OAuth2Client) {
        const data = await auth.verifyIdToken({
            idToken: auth.credentials.id_token,
            audience: auth._clientId,
        });
        return data.getPayload();
    }

    public async autheticateUser() {
        try {
            const auth = await this.authorize();
            const profile = await this.getProfileData(auth);
            return {
                email: profile.email,
                credentials: auth.credentials,
            };
        } catch (error) {
            console.log(error);
        }
    }

    public async userProfile(credentials: Credentials) {
        try {
            const content = fs.readFileSync(CREDENTIALS_PATH);
            const savedCredentials = JSON.parse(content.toString());
            const auth = new google.auth.OAuth2(
                savedCredentials.client_id,
                savedCredentials.client_secret,
            );
            auth.credentials = credentials;
            const res = await this.getProfileData(auth);
            return res;
        } catch (error) {
            console.log(error);
        }
    }
}
