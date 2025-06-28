import { Controller, Get, Inject } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ConsumerController {
  constructor(
    private readonly consumerService: ConsumerService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) { }


  @EventPattern('client-messages')
  async handleOrderCreated(data: any) {
    try {
      // Filter for messages addressed to clientB
      if (data.to !== 'clientB') {
        console.log('Message not for me. Skipped:', data);
        return;
      }

      // Log or store
      console.log('✅ Message received by clientB:', data);
      await this.consumerService.handleMessageCreated(data)
    } catch (error) {
      console.log('error in send message', error)
      // Send to DLQ topic
      await firstValueFrom(
        this.kafkaClient.emit('client-messages-dlq', {
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

  @MessagePattern('client-messages-dlq')
  handleDlq(@Payload() message: any) {
    console.warn('DLQ Received:', message);
    this.consumerService.handleMessageDlqCreated(message)
    // Save to special MongoDB collection for failed messages
  }
} 
