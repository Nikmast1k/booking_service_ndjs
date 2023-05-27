import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as path from 'path';

export class InterceptorRoom implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log(data.images);
        return {
          id: data._id,
          hotelId: data.hotelId,
          description: data.description,
          images: data.images
            ? data.images.map((image) =>
                path.join(__dirname, '..', `uploads/images/${image}`),
              )
            : [],
          isEnabled: data.isEnabled,
        };
      }),
    );
  }
}
