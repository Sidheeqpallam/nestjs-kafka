import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-app-client',
            brokers: ['localhost:9092'],
          },
          consumer: {
            allowAutoTopicCreation: true,
            groupId: 'my-app-consumer-group',
          },
          producer: {
            allowAutoTopicCreation: true
          }
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService, ClientsModule],
})
export class KafkaModule { }
