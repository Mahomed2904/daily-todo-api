import { IsDate, IsString } from 'class-validator';

export class TodoDetails {
    constructor({ id, title, description, startsAt, endsAt, createdAt }) {
        this.id = id;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.description = description;
        this.title = title;
        this.sheduledAt = createdAt;
    }

    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDate()
    startsAt: Date;

    @IsDate()
    endsAt: Date;

    @IsDate()
    sheduledAt: Date;

    imageUrl: string | undefined;
}