import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema()
export class MessageDlq extends Document {
  @Prop() from: string;
  @Prop() to: string;
  @Prop({ required: false })
  message: string

  @Prop() reason: string;
  @Prop() failedAt: string
  @Prop({ required: true, default: new Date() })
  send_time: string

}

export const MessageDlqSchema = SchemaFactory.createForClass(MessageDlq);
