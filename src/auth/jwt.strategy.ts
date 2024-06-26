import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import IConfig, { JWTConfig } from 'src/common/config/config.interface';

import 'dotenv/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService<IConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log(request?.cookies?.Authentication);
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<JWTConfig>('jwtConfig').secret ?? 'secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, username: payload.username };
  }
}
