import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../config/base.entity';
import { User } from 'src/user/user.entity';

@Entity({ name: 'calendar_credentials' })
export class CalendarCredentials extends BaseEntity {
    @Column({ name: 'acess_token', type: 'varchar', length: 2048 })
    accessToken: string;

    @Column({
        name: 'refresh_token',
        type: 'varchar',
        nullable: true,
        length: 1024,
    })
    refreshToken: string | undefined;

    @Column({ name: 'scope', type: 'varchar', length: 1024 })
    scope: string;

    @Column({
        name: 'token_type',
        type: 'varchar',
        length: 128,
        default: 'Bearer',
    })
    tokenType: string;

    @Column({ name: 'expiry_date', type: 'numeric' })
    expiryDate: number;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @OneToOne((type) => User)
    @JoinColumn()
    user: User;
}
