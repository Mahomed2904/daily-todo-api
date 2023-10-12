import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { InternalUser } from '../user/internal-user.entity';

@Entity({ name: 'verification_code' })
export class VerificationCode {
    @Column({ name: 'code', type: 'varchar', length: 200 })
    code: string;

    @PrimaryColumn()
    userId: string;

    @OneToOne(type => InternalUser)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: InternalUser;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'last_change_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastChangeAt: Date;
}
