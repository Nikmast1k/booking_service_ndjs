import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Message } from './message.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ default: true })
  isActive: boolean;
}

export const RequestSchema = SchemaFactory.createForClass(SupportRequest);
