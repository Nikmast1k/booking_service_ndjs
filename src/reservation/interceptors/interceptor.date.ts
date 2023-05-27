import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InterceptorDate implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { startDate, endDate } = request.body;
    request.body.startDate = new Date(startDate);
    request.body.endDate = new Date(endDate);
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
