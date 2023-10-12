import { Injectable } from '@nestjs/common';
import { CalendarService } from 'src/google/calendar.service';
import { TodoRepository } from './todo.repository';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UserRepository } from 'src/user/user.repository';
import { UserNotFoundError } from 'src/user/error/user-not-found.error';
import { Todo } from './todo.entity';
import { TodoParamsDTO } from './dto/list-todo-params.dto';
import { CredentialsExpiredError } from 'src/google/errror/credentials-expired.error';
import { TodoNotFoundError } from './error/todo-not-found.error';
import { AuthorizationNotGivenError } from 'src/google/errror/authorization-not-given.error';
import { TodoDetails } from './dto/todo-detais.dto';
// import { Todo } from './todo.interface';

@Injectable()
export class TodoService {
    constructor(
        private calendarService: CalendarService,
        private todoRepository: TodoRepository,
        private userRepository: UserRepository,
    ) {}

    public async listAllTodos(userId: string, params: TodoParamsDTO) {
        return await this.todoRepository.findAll(userId, params);
    }

    public async createTodo(userId: string, data: CreateTodoDTO) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }
        const todo = new Todo();
        todo.title = data.title;
        todo.description = data.description;
        todo.imageUrl = data.imageUrl;
        todo.startsAt = new Date(data.startsAt);
        todo.endsAt = new Date(data.endsAt);
        todo.user = user;
        todo.userId = user.id;
        let event = null;
        try {
            event = await this.calendarService.createEvent(user.id, todo);
        } catch (error) {
            console.log(error);
            if (error instanceof CredentialsExpiredError) {
                await this.calendarService.authorize(user);
                event = await this.calendarService.createEvent(user.id, todo);
            } else if (!(error instanceof AuthorizationNotGivenError)) {
                throw error;
            }
        }
        todo.calendarEvent = event?.id;
        const savedTodo = await this.todoRepository.save(todo);
        return savedTodo;
    }

    public async editTodo(todoId: string, newData: CreateTodoDTO) {
        const todo = await this.todoRepository.findById(todoId);
        if (!todo) {
            throw new TodoNotFoundError();
        }
        todo.title = newData.title;
        todo.imageUrl = newData.imageUrl;
        todo.description = newData.description;
        todo.startsAt = new Date(newData.startsAt);
        todo.endsAt = new Date(newData.endsAt);
        const savedTodo = await this.todoRepository.save(todo);
        if (savedTodo.calendarEvent) {
            await this.calendarService.editEvent(todo.userId, savedTodo);
        }
        return savedTodo;
    }

    public async getTodoDetails(todoId: string) {
        const todo = await this.todoRepository.findById(todoId);
        if (!todo) {
            throw new TodoNotFoundError();
        }
        return new TodoDetails(todo);
    }
}
