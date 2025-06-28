import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './app.dto';
import { SendMessageEvent } from './send-message.event';
import { KafkaService } from 'apps/kafka/kafka.service';

@Injectable()
export class AppService {
  constructor(private readonly kafkaService: KafkaService) { }


  createOrder(data: CreateMessageDto) {
    this.kafkaService.emit('client-messages', new SendMessageEvent(data.from, data.to, data.message))
  }
}
