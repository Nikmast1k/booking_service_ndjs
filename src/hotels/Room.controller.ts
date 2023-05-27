import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { HotelRoom } from './schemas/hotel.schema';
import { RoomService } from './Room.service';
import { CreateRoom } from './dto/CreateRoom';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../app/configs/multer.configuration';
import { UpdateRoom } from './dto/UpdateRoom';
import { InterceptorRoom } from './interceprors/interceptor.room';
import { SearchHotelRoomDto } from './dto/Searching';

@Controller()
export class RoomsController {
  constructor(private hotelRoomService: RoomService) {}

  @Post('admin/hotel-rooms')
  @UseInterceptors(
    FilesInterceptor('images', 10, multerOptions),
    InterceptorRoom,
  )
  async createHotelRoom(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() data: CreateRoom,
  ): Promise<HotelRoom> {
    const paths = images.map((file) => file.filename);
    return this.hotelRoomService.create({ ...data, images: [...paths] });
  }

  @Get('common/hotel-rooms/:id')
  async getHotelRoomById(@Param('id') id: string): Promise<HotelRoom> {
    return this.hotelRoomService.findById(id);
  }

  @Get('common/hotel-rooms')
  async searchHotelRooms(
    @Query() params: SearchHotelRoomDto,
  ): Promise<HotelRoom[]> {
    return this.hotelRoomService.search(params);
  }

  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(InterceptorRoom)
  async updateHotelRoom(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File> | string[],
    @Body() data: UpdateRoom,
  ): Promise<HotelRoom> {
    const paths = [];

    return this.hotelRoomService.update(id, { ...data, images: [...paths] });
  }
}
