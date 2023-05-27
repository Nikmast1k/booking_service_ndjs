import { PartialType } from '@nestjs/mapped-types';
import { CreateUser } from './CreateUser';

export class UpdateUser extends PartialType(CreateUser) {}
