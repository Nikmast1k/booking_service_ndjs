import { IsOptional, IsString, IsBoolean } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateRoom {
  @IsOptional()
  @IsString()
  hotel?: mongoose.Schema.Types.ObjectId;

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
