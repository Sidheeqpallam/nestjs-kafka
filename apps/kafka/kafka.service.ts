import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) { }

  emit(topic: string, message: any) {
    return this.kafkaClient.emit(topic, message);
  }

  send<T = any, R = any>(topic: string, message: T): Observable<R> {
    return this.kafkaClient.send(topic, message);
  }

  getClient(): ClientKafka {
    return this.kafkaClient;
  }
}
