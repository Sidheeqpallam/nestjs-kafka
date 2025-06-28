import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "CONSUMER",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumer-client-id',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'consumer-group-id'
          }
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}