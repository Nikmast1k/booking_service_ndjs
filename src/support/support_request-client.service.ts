import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateSupportRequest,
  ISupportRequestClientService,
  MarkMessagesAsRead,
} from './interfaces/interfaces';
import { ID } from '../app/types/types';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/Request.schema';

@Injectable()
export class Support_requestClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}
  async createSupportRequest(
    data: CreateSupportRequest,
  ): Promise<SupportRequest> {
    const supportRequest = new this.supportRequestModel({ user: data.user });
    const message = new this.messageModel({
      author: data.user,
      text: data.text,
    });

    await message.save();
    await supportRequest.messages.push(message);
    await supportRequest.save();

    return supportRequest.toObject();
  }

  async markMessagesAsRead(params: MarkMessagesAsRead) {
    const { supportRequest, user, createdBefore } = params;
    const filter = {
      supportRequest,
      author: { $ne: user },
      readAt: null,
      sentAt: { $lte: createdBefore },
    };
    const update = { $set: { readAt: new Date() } };
    const message = await this.messageModel.updateMany(filter, update);
    if (message) {
      return { success: true };
    } else {
      throw new Error('Failed to mark messages as read');
    }
  }

  async getUnreadCount(supportRequest: ID): Promise<Message[]> {
    const request = await this.supportRequestModel.findById(supportRequest);
    if (!request) {
      throw new NotFoundException(
        `Request with id ${supportRequest} not found`,
      );
    }
    return request.messages.filter((message) => {
      return !message.readAt;
    });
  }
}
