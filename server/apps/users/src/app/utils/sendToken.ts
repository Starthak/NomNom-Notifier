import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginResponse } from '../types/user.types';

export class TokenSender {
    
    constructor(
        private readonly config: ConfigService,
        private readonly jwt: JwtService
    ) {}
  public sendToken(user: User) : LoginResponse {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );

    const refreshToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '1h',
      },
    );
    return { user, accessToken, refreshToken };
  }
}
