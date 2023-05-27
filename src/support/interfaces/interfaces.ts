import { ID } from '../../app/types/types';
import { Message } from '../schemas/message.schema';
import { SupportRequest } from '../schemas/Request.schema';

export interface CreateSupportRequest {
  user: ID;
  text: string;
}

export interface SendMessage {
  author: ID;
  supportRequest: ID;
  text: string;
}
export interface MarkMessagesAsRead {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface ChatParams {
  user: ID | null;
  isActive: boolean;
  limit?: number;
  offset?: number;
}

export interface ISupportRequestService {
  findSupportRequests(params: ChatParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessage): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequest): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsRead);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsRead);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}
