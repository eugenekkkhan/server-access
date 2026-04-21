import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Headers('authorization') authorization: string) {
    if (!authorization?.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing Basic auth header');
    }

    const base64 = authorization.slice(6);
    if (!this.authService.validateToken(base64)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { token: base64, ok: true };
  }
}
