import { PartialType } from '@nestjs/mapped-types';
import { CreateReservation } from './CreateReservation';

export class UpdateReservation extends PartialType(CreateReservation) {}
