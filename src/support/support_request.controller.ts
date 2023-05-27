import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateRequest } from './dto/CreateRequest';
import { GuardAuth } from '../auth/guards/guard.auth';
import { RoleGuard, Roles } from '../auth/guards/guard.role';
import { EnumPossibleRoles } from '../users/enums/enum.roles';
import { Support_requestService } from './support_request.service';
import { Support_requestClientService } from './support_request-client.service';
import { Support_requestEmployeeService } from './support_request-employee.service';
import { InterceptorRequest } from './interceptors/interceptor.request';
import { SupportRequestInterceptorForManager } from './interceptors/interceptor.request.manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class Support_requestController {
  constructor(
    private readonly supportRequestService: Support_requestService,
    private readonly supportRequestClientService: Support_requestClientService,
    private readonly supportRequestEmployeeService: Support_requestEmployeeService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get('client/support-requests')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client)
  async getSupportRequestsByUser(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('isActive') isActive = true,
    @Req() request: any,
  ) {
    return this.supportRequestService.findSupportRequests({
      user: request.user.userId,
      isActive,
    });
  }
  @Get('manager/support-requests')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.manager)
  @UseInterceptors(SupportRequestInterceptorForManager)
  async getSupportRequestsManagerByUser(
    @Query('limit') limit = 10,
    @Query('userId') userId: string,
    @Query('offset') offset = 0,
    @Query('isActive') isActive = true,
    @Req() request: any,
  ) {
    return await this.supportRequestService.findSupportRequestsManager({
      user: userId,
      isActive,
    });
  }

  @Post('client/support-requests')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client)
  @UseInterceptors(InterceptorRequest)
  async createSupportRequest(
    @Body() supportRequestDto: CreateRequest,
    @Req() request: any,
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: request.user.userId,
      text: supportRequestDto.text,
    });
  }

  @Delete(':id')
  async closeSupportRequest(@Param('id') id: string) {
    return this.supportRequestEmployeeService.closeRequest(id);
  }

  @Get('common/support-requests/:id/messages')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client, EnumPossibleRoles.manager)
  async findInChat(@Param('id') id: string) {
    return this.supportRequestService.getAllMassagesByChat(id);
  }

  @Post('common/support-requests/:id/messages')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client, EnumPossibleRoles.manager)
  async sendMessage(
    @Param('id') id: string,
    @Body() bodyData: any,
    @Req() request: any,
  ) {
    const message = await this.supportRequestService.sendMessage({
      author: request.user.userId,
      supportRequest: id,
      text: bodyData.text,
    });
    if (message) {
      this.eventEmitter.emit(`newMessage-${id}`, message);
    }
    return message;
  }

  @Post('common/support-requests/:id/messages/read')
  @UseGuards(GuardAuth, RoleGuard)
  @Roles(EnumPossibleRoles.client, EnumPossibleRoles.manager)
  async readMessages(
    @Param('id') id: string,
    @Body() bodyData: any,
    @Req() request: any,
  ) {
    return await this.supportRequestClientService.markMessagesAsRead({
      user: request.user.userId,
      supportRequest: id,
      createdBefore: new Date(bodyData.createdBefore),
    });
  }
}
