import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { hashPassword } from './utils/util.auth';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashPas = await hashPassword(pass);
    if (user?.passwordHash && bcrypt.compareSync(user.passwordHash, hashPas)) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user._id, email: user.email, roles: [user.role] };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async login(user: User) {
    const payload = { userId: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
