import { PartialType } from '@nestjs/mapped-types';
import { CreateHotel } from './CreateHotel';
import { IsOptional } from 'class-validator';

export class UpdateHotel extends PartialType(CreateHotel) {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;
}
