import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUser } from './dto/CreateUser';
import { User } from './schemas/user.schema';
import { InterceptorCreateClient } from './interceptors/interceptor.CreateClient';
import { RoleGuard, Roles } from '../auth/guards/guard.role';
import { EnumPossibleRoles } from './enums/enum.roles';
import { GuardAuth } from '../auth/guards/guard.auth';
import { InterceptorCreateManager } from './interceptors/interceptor.CreateManager';
import { InterceptorDatabaseException } from './interceptors/interceptor.database.exception';

@Controller('')
@UseInterceptors(InterceptorDatabaseException)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admin/users')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.admin)
  @UseInterceptors(InterceptorCreateClient)
  async createForAdmin(@Body() createUserDto: CreateUser): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @Post('manager/users')
  @UseGuards(RoleGuard)
  @Roles(EnumPossibleRoles.manager)
  @UseInterceptors(InterceptorCreateManager)
  async createForManager(@Body() createUserDto: CreateUser): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @Post('client/register')
  @UseInterceptors(InterceptorCreateClient)
  async createClient(@Body() createUserDto: CreateUser): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('admin/users')
  @Roles(EnumPossibleRoles.admin)
  async findAll(@Body() params): Promise<User[]> {
    return this.usersService.findAll(params);
  }
  @Get('manager/users')
  @Roles(EnumPossibleRoles.manager)
  async findAllManager(@Body() params): Promise<User[]> {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get()
  findOneByEmail(@Body() email: string) {
    return this.usersService.findOneByEmail(email);
  }
}
