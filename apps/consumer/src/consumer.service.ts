import { Injectable } from '@nestjs/common';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDlq } from './schemas/message-dlq.schema';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectModel(Message.name) private readonly messageModal: Model<Message>,
    @InjectModel(MessageDlq.name) private readonly messageDlqModal: Model<MessageDlq>
  ) { }

  handleMessageCreated(data: any) {
    const createdMessage = new this.messageModal(data)
    console.log('created Message: ', createdMessage)
    return createdMessage.save()
  }

  handleMessageDlqCreated(data: any) {
    const createdMessage = new this.messageDlqModal(data)
    console.log('created DLQ Message: ', createdMessage)
    return createdMessage.save()
  }
}
