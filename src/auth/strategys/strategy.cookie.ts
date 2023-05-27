import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor() {
    super({
      usernameField: 'email',
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) =>
          request?.cookies?.Authorization?.replace('access_token ', ''),
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
}
