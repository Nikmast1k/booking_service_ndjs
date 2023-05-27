import mongoose, { Document, model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  sentAt: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  readAt: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export const MessageModel = model('Message', MessageSchema);
