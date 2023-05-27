import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from '../users/dto/Login';
import { AllowAnonymous } from './guards/guard.role';
import { CookieStrategy } from './strategys/strategy.cookie';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnonymous()
  @UseGuards(CookieStrategy)
  @Post('login')
  async signIn(@Body() signInDto: Login, @Res() res: any) {
    const accessToken = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );
    const maxAge = 3600 * 1000;
    res.cookie('access_token', accessToken, { httpOnly: true, maxAge });
    res.json({ access_token: accessToken });
  }

  @Post('logout')
  async logout(@Req() req: any, @Res() res: any) {
    res.clearCookie('access_token');
    res.json({ message: 'success' });
    res.status(200).send();
  }
}
