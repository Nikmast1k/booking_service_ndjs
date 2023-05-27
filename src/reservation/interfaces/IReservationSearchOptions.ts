import { ID } from '../../app/types/types';

export interface IReservationSearchOptions {
  userId: ID;
  dateStart: Date;
  dateEnd: Date;
}
