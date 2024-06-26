import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './common/config';

import { ThrottlerModule } from '@nestjs/throttler';

import { APP_PIPE } from '@nestjs/core';
import 'dotenv/config';
import { AuthModule } from './auth/auth.module';
import { BodyValidationPipe } from './common/pipe/body-validation.pipe';
import { UserModule } from './user/user.module';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
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
        path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    UserModule,
    AuthModule,
    DatabaseModule,
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
