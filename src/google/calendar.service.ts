import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
import { CalendarCredentialsRepositrory } from './calendar-credentials.repository';
import { CalendarCredentials } from './calendar-credentials.entity';
import { AuthorizationNotGivenError } from './errror/authorization-not-given.error';
import { User } from 'src/user/user.entity';
import { AlreadyHasActiveSyncronizationError } from './errror/already-has-active-sync.error';
import { Todo } from 'src/todo/todo.entity';
import { CredentialsExpiredError } from './errror/credentials-expired.error';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

@Injectable()
export class CalendarService {
    constructor(
        private calendarCredentialsRepository: CalendarCredentialsRepositrory,
    ) {}

    public async isAuthorized(user: User) {
        return (
            (await this.calendarCredentialsRepository.findById(user.id)) !==
            null
        );
    }

    public async authorize(user: User) {
        let calendarCredentials =
            await this.calendarCredentialsRepository.findById(user.id);
        if (
            calendarCredentials &&
            (calendarCredentials.refreshToken ||
                calendarCredentials.expiryDate > Date.now())
        ) {
            throw new AlreadyHasActiveSyncronizationError();
        }
        const clientCredentials = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (!calendarCredentials) {
            calendarCredentials = new CalendarCredentials();
        }
        calendarCredentials.accessToken =
            clientCredentials.credentials.access_token;
        calendarCredentials.expiryDate =
            clientCredentials.credentials.expiry_date;
        calendarCredentials.refreshToken =
            clientCredentials.credentials.refresh_token;
        calendarCredentials.scope = clientCredentials.credentials.scope;
        calendarCredentials.tokenType =
            clientCredentials.credentials.token_type;
        calendarCredentials.user = user;
        calendarCredentials.userId = user.id;
        const savedCredentials =
            await this.calendarCredentialsRepository.save(calendarCredentials);
        return savedCredentials;
    }

    private async getAuthorization(userId: string) {
        const credentials =
            await this.calendarCredentialsRepository.findById(userId);
        if (!credentials) {
            throw new AuthorizationNotGivenError();
        } else if (
            !credentials.refreshToken &&
            credentials.expiryDate < Date.now()
        ) {
            throw new CredentialsExpiredError();
        }
        const content = fs.readFileSync(CREDENTIALS_PATH);
        const savedCredentials = JSON.parse(content.toString());
        const auth = new google.auth.OAuth2(
            savedCredentials.client_id,
            savedCredentials.client_secret,
        );
        auth.credentials = {
            access_token: credentials.accessToken,
            expiry_date: credentials.expiryDate,
            refresh_token: credentials.refreshToken,
            scope: credentials.scope,
            token_type: credentials.tokenType,
        };
        return auth;
    }

    public async listEvents(userId: string) {
        const auth = await this.getAuthorization(userId);
        const calendar = google.calendar({ version: 'v3', auth: auth });
        const res = await calendar.events.list({
            calendarId: 'primary',
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const events = res.data?.items;
        if (!events || events.length === 0) {
            console.log('No upcoming events found.');
            return res;
        }
        console.log('Upcoming 10 events:');
        events?.map((event) => {
            const start = event.start.dateTime || event.start.date;
            console.log(`${start} - ${event.summary}`);
        });
        return res.data.items;
    }

    async createEvent(userId: string, todo: Todo) {
        const auth = await this.getAuthorization(userId);
        const calendar = google.calendar({ version: 'v3', auth: auth });
        const event = {
            summary: todo.title,
            description: todo.description,
            start: {
                dateTime: todo.startsAt.toISOString(),
                timeZone: 'Africa/Maputo',
            },
            end: {
                dateTime: todo.endsAt.toISOString(),
                timeZone: 'Africa/Maputo',
            },
            recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
            attendees: [
                { email: 'mahomedaly2000@gmail.com' },
                { email: 'mahomedaly2000@gmail.com' },
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
                    { method: 'popup', minutes: 20 },
                ],
            },
        };

        const res = await calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            requestBody: event,
        });
        return res.data;
    }

    async editEvent(userId: string, todo: Todo) {
        const auth = await this.getAuthorization(userId);
        const calendar = google.calendar({ version: 'v3', auth: auth });
        const event = {
            summary: todo.title,
            description: todo.description,
            start: {
                dateTime: todo.startsAt.toISOString(),
                timeZone: 'Africa/Maputo',
            },
            end: {
                dateTime: todo.endsAt.toISOString(),
                timeZone: 'Africa/Maputo',
            },
            recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
            attendees: [
                { email: 'mahomedaly2000@gmail.com' },
                { email: 'mahomedaly2000@gmail.com' },
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
                    { method: 'popup', minutes: 20 },
                ],
            },
        };

        const res = await calendar.events.update({
            auth: auth,
            calendarId: 'primary',
            requestBody: event,
            eventId: todo.calendarEvent,
        });
        return res.data;
    }
}
