import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Todo } from '../todo/todo.entity';
import { InternalUser } from '../user/internal-user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { VerificationCode } from '../verification-code/verification-code.entity';
import { UserDetails } from '../user/user-details.entity';
import { User } from '../user/user.entity';
import { ExternalUser } from '../user/external-user.entity';

dotenv.config();

@Injectable()
export class ConfigService {
    constructor(private readonly env: { [k: string]: string } | undefined) {}

    private getKeyValue(key: string, throwErrorIfMissing = true): string {
        const value = this.env[key];
        if (!value && throwErrorIfMissing) {
            throw new Error(`config error - missing env.${key}`);
        }
        return value;
    }

    public verifyValues(keys: string[]) {
        keys.forEach((k) => this.getKeyValue(k, true));
        return this;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.getKeyValue('POSTGRES_HOST'),
            port: parseInt(this.getKeyValue('POSTGRES_PORT')),
            username: this.getKeyValue('POSTGRES_USER'),
            password: this.getKeyValue('POSTGRES_PASSWORD'),
            database: this.getKeyValue('POSTGRES_DATABASE'),
            // entities: [join('../', __dirname, '**', '*.entity.{ts,js}')],
            entities: [
                Todo,
                User,
                InternalUser,
                ExternalUser,
                UserDetails,
                VerificationCode,
            ],
            synchronize: true,
            autoLoadEntities: true,
            migrationsTableName: 'src/migrations',
            migrations: ['src/migrations/*.ts'],
        };
    }

    public getDataSourceOptions(): DataSourceOptions {
        return {
            type: 'postgres',
            host: this.getKeyValue('POSTGRES_HOST'),
            port: parseInt(this.getKeyValue('POSTGRES_PORT')),
            username: this.getKeyValue('POSTGRES_USER'),
            password: this.getKeyValue('POSTGRES_PASSWORD'),
            database: this.getKeyValue('POSTGRES_DATABASE'),
            // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            entities: [
                Todo,
                User,
                InternalUser,
                ExternalUser,
                UserDetails,
                VerificationCode,
            ],
            synchronize: true,
            migrationsTableName: 'src/migrations',
            migrations: ['src/migrations/*.ts'],
        };
    }
}

export const config = new ConfigService(process.env).verifyValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
]);

export default new DataSource(config.getDataSourceOptions());
