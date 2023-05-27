import { ID } from '../../app/types/types';
import { IReservationDto } from './IReservationDto';
import { IReservationSearchOptions } from './IReservationSearchOptions';
import { Reservation } from '../schemas/Reservation';

export interface IReservation {
  addReservation(data: IReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: IReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
