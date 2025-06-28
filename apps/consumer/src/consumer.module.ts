import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schemas/message.schema';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { MessageDlqSchema } from './schemas/message-dlq.schema';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Message', schema: MessageSchema },
      { name: 'MessageDlq', schema: MessageDlqSchema }
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'client-b',
          },
          consumer: {
            groupId: 'dlq-producer',
          },
        },
      },
    ]),
  ],
  controllers: [ConsumerController],
  providers: [

    ConsumerService],
})
export class ConsumerModule { }
