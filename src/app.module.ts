import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { PhotoController } from './photo/photo.controller';
import { PhotoService } from './photo/photo.service';

@Module({
  imports: [TodoModule],
  controllers: [AppController, UserController, PhotoController],
  providers: [AppService, UserService, PhotoService],
})
export class AppModule {}
