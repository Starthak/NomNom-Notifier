import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Seller } from '../../../node_modules/.prisma/client';
import { LoginResponse } from '../types/seller.types';

export class TokenSender {
    
    constructor(
        private readonly config: ConfigService,
        private readonly jwt: JwtService
    ) {}
  public sendToken(seller: Seller) : LoginResponse {
    const accessToken = this.jwt.sign(
      {
        id: seller.id,
      },
      {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwt.sign(
      {
        id: seller.id,
      },
      {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );
    return { seller, accessToken, refreshToken };
  }
}
