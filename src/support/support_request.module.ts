import { Module } from '@nestjs/common';
import { Support_requestService} from "./support_request.service";
import { Support_requestController} from "./support_request.controller";
import {MongooseModule} from "@nestjs/mongoose";
import {SupportRequest, RequestSchema} from "./schemas/Request.schema";
import {Message, MessageSchema} from "./schemas/message.schema";
import {EventEmitter2} from "@nestjs/event-emitter";
import {Support_requestClientService} from "./support_request-client.service";
import {Support_requestEmployeeService} from "./support_request-employee.service";
import {SupportRequestGateway} from "./support_request.geteway";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: RequestSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [Support_requestController],
  providers: [SupportRequestGateway, Support_requestService, EventEmitter2, Support_requestClientService, Support_requestEmployeeService]
})
export class Support_requestModule {}
