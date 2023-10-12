import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export abstract class BaseEntity {
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
