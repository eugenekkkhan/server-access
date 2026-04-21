import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly username: string;
  private readonly password: string;

  constructor() {
    this.username = process.env.AUTH_USER || 'admin';
    this.password = process.env.AUTH_PASS || 'changeme';
  }

  validate(username: string, password: string): boolean {
    // Constant-time comparison to prevent timing attacks
    const userMatch = crypto.timingSafeEqual(
      Buffer.from(username),
      Buffer.from(this.username),
    );
    const passMatch = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(this.password),
    );
    return userMatch && passMatch;
  }

  validateToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const [username, ...rest] = decoded.split(':');
      const password = rest.join(':');
      return this.validate(username, password);
    } catch {
      return false;
    }
  }
}
