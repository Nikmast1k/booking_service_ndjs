import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InterceptorRequest implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return [
          {
            id: data._id,
            createdAt: data.createdAt,
            isActive: data.isActive,
            hasNewMessages: true,
          },
        ];
      }),
    );
  }
}
