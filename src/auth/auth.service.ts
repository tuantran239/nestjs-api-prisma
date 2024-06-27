import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  async hashPassword() {}

  async login(payload: LoginDto): Promise<User> {
    const { username, password } = payload;

    const user = await this.userService.retrieve({
      where: {
        OR: [
          { username: { equals: username } },
          { email: { equals: username } },
        ],
      },
    });

    if (!user) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.username_email_not_match', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.password_not_match', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return user;
  }

  async register(payload: CreateUserDto): Promise<User> {
    const { username, password, email } = payload;

    const userEmail = await this.userService.retrieve({ where: { email } });

    if (userEmail) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.email_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const userUsername = await this.userService.retrieve({
      where: { username },
    });

    if (userUsername) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.username_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const newUser = await this.userService.create(payload);

    return newUser;
  }
}
