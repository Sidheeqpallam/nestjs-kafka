import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateMessageDto } from './app.dto';
import { SendMessageEvent } from './send-message.event';
import { KafkaService } from 'apps/kafka/kafka.service';
import { firstValueFrom } from 'rxjs';
import { KafkaTopics } from 'apps/kafka/kafka-topics';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
  ) { }

  async onModuleInit() {
    this.kafkaService.getClient().subscribeToResponseOf(KafkaTopics.MESSAGE)
    this.kafkaService.getClient().subscribeToResponseOf(KafkaTopics.MESSAGE_GET)
    this.kafkaService.getClient().subscribeToResponseOf(KafkaTopics.MESSAGE_GET_FAILED)
    await this.kafkaService.getClient().connect()
  }

  async createMessage(data: CreateMessageDto) {
    const result = await firstValueFrom(
      this.kafkaService.getClient().send(KafkaTopics.MESSAGE, new SendMessageEvent(data.from, data.to, data.message))
    )

    return result
  }

  async retrieveMessages() {
    return await firstValueFrom(
      this.kafkaService.getClient().send(KafkaTopics.MESSAGE_GET, {})
    )
  }

  async retrieveFailedMessages() {
    return await firstValueFrom(
      this.kafkaService.getClient().send(KafkaTopics.MESSAGE_GET_FAILED, {})
    )
  }
}
