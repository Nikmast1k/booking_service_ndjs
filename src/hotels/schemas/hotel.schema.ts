import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;
export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class Hotel {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

@Schema()
export class HotelRoom {
  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isEnabled: boolean;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
