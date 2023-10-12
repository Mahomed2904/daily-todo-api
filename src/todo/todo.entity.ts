import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../config/base.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'todo' })
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'start_at', type: 'timestamptz' })
    startsAt: Date;

    @Column({ name: 'end_at', type: 'timestamptz' })
    endsAt: Date;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string | undefined;

    @Column({ name: 'calendarEvent', nullable: true })
    calendarEvent: string | undefined;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column()
    userId: string;

    @ManyToOne((type) => User, (user) => user.todos)
    user: User;
}
