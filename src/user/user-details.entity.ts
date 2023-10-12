import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { InternalUser } from './internal-user.entity';

@Entity({ name: 'user_details' })
export class UserDetails {
    @Column({ name: 'name', type: 'varchar', length: 256, nullable: false })
    name: string;

    @Column({ name: 'phone_number', type: 'varchar', length: 200 })
    phoneNumber: string;

    @Column({ name: 'profile_photo', type: 'varchar', nullable: true })
    profilePhoto: string | undefined;

    @PrimaryColumn()
    userId: string;

    @OneToOne(type => InternalUser)
    @JoinColumn()
    user: InternalUser;
}
