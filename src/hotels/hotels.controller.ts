import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Hotel } from './schemas/hotel.schema';
import { UpdateHotel } from './dto/UpdateHotel';
import { GuardAuth } from '../auth/guards/guard.auth';
import { RoleGuard, Roles } from '../auth/guards/guard.role';
import { HotelsService } from './hotels.service';
import { CreateHotel } from './dto/CreateHotel';
import { EnumPossibleRoles } from '../users/enums/enum.roles';
import { SearchHotelDto } from './dto/Searching';

@Controller('admin/hotels')
export class HotelsController {
  constructor(private hotelService: HotelsService) {}

  @Post()
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.admin)
  async createHotel(@Body() data: CreateHotel): Promise<Hotel> {
    return this.hotelService.create(data);
  }
  @Get(':id')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.admin)
  async getHotelById(@Param('id') id: string): Promise<Hotel> {
    return this.hotelService.findById(id);
  }
  @Get()
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.admin)
  async searchHotels(@Query() params: SearchHotelDto): Promise<Hotel[]> {
    return this.hotelService.search(params);
  }

  @Put(':id')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.admin)
  async updateHotel(
    @Param('id') id: string,
    @Body() data: UpdateHotel,
  ): Promise<Hotel> {
    return this.hotelService.update(id, data);
  }
}
