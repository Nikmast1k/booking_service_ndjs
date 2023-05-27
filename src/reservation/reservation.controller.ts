import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { IReservationDto } from './interfaces/IReservationDto';
import { Reservation } from './schemas/Reservation';
import { RoleGuard, Roles } from '../auth/guards/guard.role';
import { EnumPossibleRoles } from '../users/enums/enum.roles';
import { ReservationSearching } from './dto/SearchingReservation';
import { GuardAuth } from '../auth/guards/guard.auth';

@Controller('client/reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client)
  async addReservation(@Body() data: IReservationDto): Promise<Reservation> {
    return this.reservationService.addReservation(data);
  }

  @Delete(':id')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client)
  async removeReservation(@Param('id') id: string): Promise<void> {
    await this.reservationService.removeReservation(id);
  }

  @Get()
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client)
  async getReservations(
    @Query() query: ReservationSearching,
  ): Promise<Reservation[]> {
    return this.reservationService.getReservations(query);
  }

  @Get('/:userId')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.manager)
  async getReservationsByUserId(
    @Param('userId') userId: string,
  ): Promise<Reservation[]> {
    return this.reservationService.getReservations({ userId: userId });
  }
}
