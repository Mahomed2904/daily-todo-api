import { Injectable } from '@nestjs/common';
import { Todo } from './todo.interface';

@Injectable()
export class TodoService {
  listAllTodos(): Array<Todo> {
    return [
      {
        title: 'Go to the market buy a new car',
        description:
          'I have to the market to buy a new car because my current car is very old',
      },
      {
        title: 'Visit my mother in Nampula',
        description: 'Visiit my mother in here place',
      },
    ];
  }
}
