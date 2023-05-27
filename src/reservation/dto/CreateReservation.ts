import { IReservationDto } from '../interfaces/IReservationDto';
import { ID } from '../../app/types/types';

export class CreateReservation implements IReservationDto {
  endDate: Date;
  startDate: Date;
  hotelId: ID;
  roomId: ID;
  userId: ID;
}
