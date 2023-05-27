import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ID } from '../../app/types/types';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'HotelRoom',
  })
  hotelRoom: ID;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;
}
const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index(
  { hotelRoom: 1, startDate: 1, endDate: 1 },
  { unique: true },
);

export default ReservationSchema;
