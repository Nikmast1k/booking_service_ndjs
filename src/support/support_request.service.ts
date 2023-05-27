import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ChatParams,
  ISupportRequestService,
  SendMessage,
} from './interfaces/interfaces';
import { ID } from '../app/types/types';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest } from './schemas/Request.schema';
import { concatMap, filter, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Support_requestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    const event = 'newMessage';
    this.eventEmitter.on(event, handler);

    return () => this.eventEmitter.off(event, handler);
  }

  async sendMessage({
    author,
    supportRequest,
    text,
  }: SendMessage): Promise<Message> {
    const message = new this.messageModel({
      author,
      supportRequest,
      text,
    });
    await message.save();
    const updatedSupportRequest = await this.supportRequestModel
      .findByIdAndUpdate(supportRequest, {
        $push: { messages: message },
      })
      .populate('user')
      .exec();
    this.eventEmitter.emit('newMessage', updatedSupportRequest, message);
    return message.populate({
      path: 'author',
      model: 'User',
      select: '_id name',
    });
  }

  async getMessages(supportRequestId: ID): Promise<Message[]> {
    const supportRequest = await this.supportRequestModel
      .findById(supportRequestId)
      .populate('messages.author')
      .exec();
    if (!supportRequest) {
      throw new NotFoundException('Request not found');
    }
    return supportRequest.get('messages') as Message[];
  }

  async findSupportRequests(data: ChatParams): Promise<SupportRequest[]> {
    const query = this.supportRequestModel
      .find({ isActive: data.isActive })
      .where('user', data.user);
    if (data.offset) {
      query.skip(data.offset);
    }
    if (data.limit) {
      query.limit(data.limit);
    }
    return query;
  }
  async findSupportRequestsManager(
    data: ChatParams,
  ): Promise<SupportRequest[]> {
    const query = this.supportRequestModel
      .find({ isActive: data.isActive })
      .where('user', data.user)
      .populate({
        path: 'messages',
      });
    if (data.offset) {
      query.skip(data.offset);
    }
    if (data.limit) {
      query.limit(data.limit);
    }
    return query.populate('user').exec();
  }
  async getAllMassagesByChat(id: string) {
    const chat = await this.supportRequestModel.findById(id).populate({
      path: 'messages',
      populate: {
        path: 'author',
        model: 'User',
        select: 'name',
      },
    });
    return chat.messages.map((message) => {
      return {
        id: message._id,
        createdAt: message.sentAt,
        text: message.text,
        readAt: message.readAt,
        author: {
          id: message.author._id,
          name: message.author['name'],
        },
      };
    });
  }
  getMessageStreamForChat(chatId: ID): Observable<Message> {
    return from(
      this.supportRequestModel.findOne({ _id: chatId }).populate('messages'),
    ).pipe(
      filter((supportRequest) => !!supportRequest),
      map((supportRequest) => supportRequest.messages),
      concatMap((messages) => messages),
    );
  }
}
