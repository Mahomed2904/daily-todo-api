import { IsDateString, IsString } from 'class-validator';

export class CreateTodoDTO {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    startsAt: string;

    @IsDateString()
    endsAt: string;

    imageUrl: string | undefined;
}
