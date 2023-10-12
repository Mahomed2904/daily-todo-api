import { Injectable } from '@nestjs/common';

export interface Greeting {
    greeting: string;
}

@Injectable()
export class AppService {
    getHello(): Greeting {
        return {
            greeting: 'Hello World!',
        };
    }
}
