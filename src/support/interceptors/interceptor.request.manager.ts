import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SupportRequestInterceptorForManager implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data.map((chat) => {
          return {
            id: chat._id,
            createdAt: chat.createdAt,
            isActive: chat.isActive,
            hasNewMessages: !!chat.messages.find((message) => !message.readAt),
            client: {
              id: chat.user._id,
              name: chat.user.name,
              email: chat.user.email,
              contactPhone: chat.user.contactPhone
                ? chat.user.contactPhone
                : '',
            },
          };
        });
      }),
    );
  }
}
