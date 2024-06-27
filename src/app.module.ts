import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './common/config';

import { ThrottlerModule } from '@nestjs/throttler';

import { APP_PIPE } from '@nestjs/core';
import 'dotenv/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { BodyValidationPipe } from './common/pipe/body-validation.pipe';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, './i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    RoleModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: BodyValidationPipe,
    },
  ],
})
export class AppModule {}
