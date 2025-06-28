import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema()
export class Message extends Document {
  @Prop() from: string;
  @Prop() to: string;
  @Prop({ required: true })
  message: string

  @Prop({ required: true, default: new Date() })
  send_time: string
}

export const MessageSchema = SchemaFactory.createForClass(Message);
