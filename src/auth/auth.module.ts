import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import 'dotenv/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IConfig, { JWTConfig } from 'src/common/config/config.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig>) => ({
        secret: configService.get<JWTConfig>('jwtConfig').secret,
        signOptions: {
          expiresIn: configService.get<JWTConfig>('jwtConfig').expireIn,
        },
      }),
    }),
    UserModule,
    PassportModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
