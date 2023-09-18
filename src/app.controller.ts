import { Controller, Get } from '@nestjs/common';
import { AppService, Greeting } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Greeting {
    return this.appService.getHello();
  }
}
