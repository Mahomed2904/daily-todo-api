import { Injectable } from '@nestjs/common';
import { Todo } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoParamsDTO } from './dto/list-todo-params.dto';

@Injectable()
export class TodoRepository {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>,
    ) {}

    async save(todo: Todo) {
        return await this.todoRepository.save(todo);
    }

    async findAll(userId: string, params: TodoParamsDTO) {
        const baseTime = new Date();
        baseTime.setTime(0);
        const data = this.todoRepository
            .createQueryBuilder('todo')
            .where('todo.userId = :userId', { userId: userId })
            .andWhere('todo.title like :title', {
                title: `%${params.title || ''}%`,
            })
            .andWhere('todo.start_at >= :startAt', {
                startAt: params.startAt || baseTime,
            })
            .limit(params.maxSize)
            .getMany();
        return data;
    }

    async findById(todoId: string) {
        return await this.todoRepository.findOneBy({
            id: todoId,
        });
    }

    async delete(todo: Todo) {
        return await this.todoRepository.delete(todo.id);
    }
}
