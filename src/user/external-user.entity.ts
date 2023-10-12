import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../config/base.entity';

@Entity({ name: 'external_user' })
export class ExternalUser extends BaseEntity {
    @Column({ name: 'email', type: 'varchar', length: 256 })
    email: string;

    @Column({ name: 'acess_token', type: 'varchar', length: 2048 })
    accessToken: string;

    @Column({ name: 'refresh_token', type: 'varchar', length: 1024 })
    refreshToken: string;

    @Column({ name: 'scope', type: 'varchar', length: 1024 })
    scope: string;

    @Column({
        name: 'token_type',
        type: 'varchar',
        length: 128,
        default: 'Bearer',
    })
    tokenType: string;

    @Column({ name: 'id_token', type: 'varchar', length: 2048 })
    idToken: string;

    @Column({ name: 'expiry_date', type: 'numeric' })
    expiryDate: number;

    @PrimaryColumn()
    userId: string;

    @OneToOne((type) => User)
    @JoinColumn()
    user: User;
}
