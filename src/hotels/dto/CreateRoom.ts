import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateRoom {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
