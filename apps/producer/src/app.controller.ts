import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMessageDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('send-message')
  createOrder(@Body() payload: CreateMessageDto) {
    this.appService.createOrder(payload)
    return 'hi there'
  }
}
