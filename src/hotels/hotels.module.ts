import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { RoomService } from './Room.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Hotel,
  HotelRoom,
  HotelRoomSchema,
  HotelSchema,
} from './schemas/hotel.schema';
import { RoomsController } from './Room.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    FilesModule,
  ],
  controllers: [HotelsController, RoomsController],
  providers: [HotelsService, RoomService],
})
export class HotelsModule {}
