import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './app.dto';
import { ClientKafka } from '@nestjs/microservices';
import { SendMessageEvent } from './send-message.event';

@Injectable()
export class AppService {
  constructor(
    @Inject('CONSUMER') private readonly consumerProxyClient: ClientKafka
  ) { }

  createOrder(data: CreateMessageDto) {
    this.consumerProxyClient.emit('client-messages', new SendMessageEvent(data.from, data.to, data.message))
  }
}
