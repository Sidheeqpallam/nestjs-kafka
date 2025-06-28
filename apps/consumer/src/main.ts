import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'consumer-group-id',
        retry: {
          retries: 3,
          initialRetryTime: 1000,
          maxRetryTime: 3000,
        },
      },

    }
  });
  await app.listen();
}
bootstrap();
