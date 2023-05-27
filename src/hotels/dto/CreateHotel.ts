import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHotel {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}
