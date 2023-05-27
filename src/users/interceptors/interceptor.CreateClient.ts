import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnumPossibleRoles } from '../enums/enum.roles';
import { hashPassword } from '../../auth/utils/util.auth';

@Injectable()
export class InterceptorCreateClient implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { password, role } = request.body;
    request.body.passwordHash = hashPassword(password);
    request.body.role = role ? role : EnumPossibleRoles.client;
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
