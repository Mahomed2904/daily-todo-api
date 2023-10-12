import {
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../config/base.entity';
import { ExternalUser } from './external-user.entity';
import { InternalUser } from './internal-user.entity';
import { Todo } from 'src/todo/todo.entity';
import { CalendarCredentials } from 'src/google/calendar-credentials.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => ExternalUser)
    @JoinColumn()
    externalUser: ExternalUser;

    @OneToOne(() => InternalUser)
    @JoinColumn()
    internalUser: InternalUser;

    @OneToOne(() => CalendarCredentials)
    @JoinColumn()
    calendarCredentials: CalendarCredentials;

    @OneToMany(() => Todo, (todo) => todo.user)
    todos: Todo[];
}
