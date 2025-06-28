import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMessageDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('send-message')
  async createMessage(@Body() payload: CreateMessageDto) {
    const res = await this.appService.createMessage(payload)
    return res
  }

  @Get('messages')
  async retrieveMessages() {
    return await this.appService.retrieveMessages()
  }

  @Get('failed-messages')
  async retrieveFailedMessages() {
    return await this.appService.retrieveFailedMessages()
  }
}
