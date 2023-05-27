import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsRead,
} from './interfaces/interfaces';
import { ID } from '../app/types/types';
import { Message } from './schemas/message.schema';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/Request.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class Support_requestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsRead): Promise<void> {
    const { supportRequest, user, createdBefore } = params;
    await this.supportRequestModel.findOneAndUpdate(
      {
        _id: supportRequest,
        user,
        'messages.sentAt': { $lt: createdBefore },
        'messages.readAt': { $exists: false },
      },
      { $set: { 'messages.$[message].readAt': new Date() } },
      {
        arrayFilters: [{ 'message.author': { $ne: user } }],
        new: true,
        runValidators: true,
      },
    );
  }
  async getUnreadCount(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.supportRequestModel
      .findById(supportRequestId)
      .exec();
    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }
    const messages = supportRequest.get('messages') as Message[];
    return messages.filter((msg) => !msg.readAt);
  }

  async closeRequest(supportRequest: ID): Promise<void> {
    await this.supportRequestModel.findByIdAndUpdate(supportRequest, {
      isActive: false,
    });
  }
}
