import { PartialType } from '@nestjs/mapped-types';
import { CreateRequest } from './CreateRequest';

export class UpdateRequest extends PartialType(CreateRequest) {}
