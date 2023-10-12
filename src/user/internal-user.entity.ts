import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user-details.entity';
import { VerificationCode } from 'src/verification-code/verification-code.entity';
import { User } from './user.entity';
import { BaseEntity } from '../config/base.entity';

@Entity({ name: 'internal_user' })
export class InternalUser extends BaseEntity {
    @Column({ name: 'email', type: 'varchar', length: 128 })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 1024 })
    password: string;

    @Column({ name: 'is_active', type: 'boolean', default: false })
    isActivated: boolean;

    @Column({ name: 'reset_password', type: 'boolean', default: false })
    resetPassword: boolean;

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @OneToOne(type => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;

    @OneToOne(type => UserDetails)
    @JoinColumn()
    userDetails: UserDetails;

    @OneToOne((type) => VerificationCode)
    @JoinColumn()
    emailVerification: VerificationCode;
}
