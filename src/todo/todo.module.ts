import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { GoogleModule } from 'src/google/calendar.module';
import { TodoRepository } from './todo.repository';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), GoogleModule, UserModule],
    controllers: [TodoController],
    providers: [TodoService, TodoRepository],
    exports: [TypeOrmModule],
})
export class TodoModule {}
