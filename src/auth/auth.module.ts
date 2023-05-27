import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CookieStrategy } from './strategys/strategy.cookie';

@Module({
  imports: [UsersModule],
  providers: [AuthService, CookieStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
