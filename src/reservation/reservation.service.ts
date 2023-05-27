import { ConflictException, Injectable } from '@nestjs/common';
import { IReservation } from './interfaces/IReservation';
import { IReservationDto } from './interfaces/IReservationDto';
import { ID } from '../app/types/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './schemas/Reservation';
import { ReservationSearching } from './dto/SearchingReservation';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: IReservationDto): Promise<Reservation> {
    const existingReservation = await this.reservationModel.findOne({
      roomId: data.roomId,
      dateStart: { $lt: data.endDate },
      dateEnd: { $gt: data.startDate },
    });
    if (existingReservation) {
      throw new ConflictException(`${data.roomId} Not available`);
    }
    const reservation = new this.reservationModel(data);
    return reservation.save();
  }

  getReservations(filter: ReservationSearching): Promise<Array<Reservation>> {
    const query = this.reservationModel.find();
    if (filter.userId) {
      query.where({ userId: filter.userId });
    }
    if (filter.dateStart) {
      query.where({ dateStart: { $gte: filter.dateStart } });
    }
    if (filter.dateEnd) {
      query.where({ dateEnd: { $lte: filter.dateEnd } });
    }
    return query.exec();
  }

  async removeReservation(id: ID): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id).exec();
  }
}
