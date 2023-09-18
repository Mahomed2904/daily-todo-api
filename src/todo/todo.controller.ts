import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Response } from 'express';

@Controller('api/todo')
export class TodoController {
  constructor(private todoServices: TodoService) {}

  @Get() getAll(@Res() res: Response) {
    res.status(HttpStatus.CREATED).json(this.todoServices.listAllTodos());
  }
}
