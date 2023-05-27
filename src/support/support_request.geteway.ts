import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Support_requestService} from "./support_request.service";
import {Message} from "./schemas/message.schema";
import {EventEmitter2} from "@nestjs/event-emitter";


@WebSocketGateway({ cors: true })
export class SupportRequestGateway {
    constructor(
        private readonly supportRequestService: Support_requestService,
        private eventEmitter: EventEmitter2,
    ) {}
    @WebSocketServer() server: Server;

    @SubscribeMessage('subscribeToChat')
    handleSubscribeToChat(
        @MessageBody() chatId: string,
        @ConnectedSocket() client: Socket
    ): void {
        const message$ = this.supportRequestService.getMessageStreamForChat(chatId);
        message$.subscribe((message: Message) => {
            client.emit(`chatMessage-${chatId}`, message);
        });
        this.eventEmitter.on(`newMessage-${chatId}`, (data) => {
            client.emit(`chatMessage-${chatId}`, data);
        });
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() payload: string,
        @ConnectedSocket() client: Socket
    ): string {
        const idChat= '644e3a9a647cccdfb92a051f';
        this.eventEmitter.emit('chatMessage', idChat, {text: 'text'});
        return 'Hello';
    }
}