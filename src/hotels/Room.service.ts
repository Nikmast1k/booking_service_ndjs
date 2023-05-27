import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Hotel,
  HotelDocument,
  HotelRoom,
  HotelRoomDocument,
} from './schemas/hotel.schema';
import { ISearchRoomsParams } from './interfaces/ISearchRoomsParams';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    const hotelRoom = new this.hotelRoomModel(data);
    return await hotelRoom.save();
  }
  async findById(id: string): Promise<HotelRoom> {
    return this.hotelRoomModel.findById(id).exec();
  }

  async search(params: ISearchRoomsParams): Promise<HotelRoom[]> {
    const { limit, offset, hotel, isEnabled } = params;
    const query: any = { hotel };
    if (isEnabled !== undefined) {
      query.isEnabled = isEnabled;
    }
    return this.hotelRoomModel.find(query).skip(offset).limit(limit).exec();
  }

  async update(id: string, data: Partial<HotelRoom>): Promise<HotelRoom> {
    const hotelRoom = await this.hotelRoomModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!hotelRoom) {
      throw new NotFoundException(`Hotel room with id ${id} not found`);
    }
    return hotelRoom;
  }
}
