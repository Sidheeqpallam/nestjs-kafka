import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { KafkaTopics } from 'apps/kafka/kafka-topics';
import { KafkaService } from 'apps/kafka/kafka.service';

@Controller()
export class ConsumerController {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly kafkaService: KafkaService
  ) { }


  @EventPattern(KafkaTopics.MESSAGE)
  async handleOrderCreated(data: any) {
    try {
      // Filter for messages addressed to clientB
      if (data.to !== 'clientB') {
        console.log('Message not for me. Skipped:', data);
        return;
      }

      console.log('✅ Message received by clientB:', data);
      await this.consumerService.handleMessageCreated(data)
    } catch (error) {
      console.log('error in send message', error)
      // Send to DLQ topic
      await firstValueFrom(
        this.kafkaService.emit(KafkaTopics.DLQ, {
          key: data.to,
          value: JSON.stringify({
            ...data,
            reason: error.message,
            failedAt: new Date(),
          }),
        })
      );
    }
  }

  @MessagePattern(KafkaTopics.DLQ)
  handleDlq(@Payload() message: any) {
    console.warn('DLQ Received:', message);
    this.consumerService.handleMessageDlqCreated(message)
  }
} 
