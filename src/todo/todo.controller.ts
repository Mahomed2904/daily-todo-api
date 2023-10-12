import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { TodoParamsDTO } from './dto/list-todo-params.dto';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UserNotFoundError } from 'src/user/error/user-not-found.error';
import { AuthorizationNotGivenError } from 'src/google/errror/authorization-not-given.error';
import { TodoNotFoundError } from './error/todo-not-found.error';

@Controller('todo')
export class TodoController {
    constructor(private todoServices: TodoService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getAll(@Req() req: { userId: string }, @Query() data: TodoParamsDTO) {
        try {
            return await this.todoServices.listAllTodos(req.userId, data);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    async createTodo(
        @Req() req: { userId: string },
        @Body() data: CreateTodoDTO,
    ) {
        try {
            return await this.todoServices.createTodo(req.userId, data);
        } catch (error) {
            if (error instanceof UserNotFoundError)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            else {
                throw new HttpException(
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async editTodo(@Param('id') id: string, @Body() data: CreateTodoDTO) {
        try {
            return await this.todoServices.editTodo(id, data);
        } catch (error) {
            if (error instanceof TodoNotFoundError)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            else {
                throw new HttpException(
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async todoDetails(@Param('id') id: string) {
        try {
            return await this.todoServices.getTodoDetails(id);
        } catch (error) {
            if (error instanceof TodoNotFoundError)
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            else {
                throw new HttpException(
                    error.message,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
