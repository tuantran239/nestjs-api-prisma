import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import IConfig, { JWTConfig } from 'src/common/config/config.interface';
import { COOKIE_AUTH_TOKEN } from 'src/common/constant/cookie';
import { ResponseData } from 'src/common/interface';
import { BodyValidationPipe } from 'src/common/pipe/body-validation.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthRouter } from './auth.router';

@ApiTags('auth')
@Controller(AuthRouter.ROOT)
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService<IConfig>,
  ) {}

  @Post(AuthRouter.LOGIN)
  async login(
    @Body(new BodyValidationPipe()) payload: LoginDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.login(payload);

      const token = await this.jwtService.sign(
        { userId: user.id, username: user.username },
        { secret: this.configService.get<JWTConfig>('jwtConfig').secret },
      );

      res.cookie(COOKIE_AUTH_TOKEN, token);

      const responseData: ResponseData = {
        error: null,
        data: { token },
        message: 'success',
        statusCode: 200,
      };

      return res.status(201).send(responseData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post(AuthRouter.REGISTER)
  async register(
    @Body(new BodyValidationPipe()) payload: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.register(payload);

      const token = await this.jwtService.sign(
        { userId: user.id, username: user.username },
        { secret: this.configService.get<JWTConfig>('jwtConfig').secret },
      );

      res.cookie(COOKIE_AUTH_TOKEN, token);

      const responseData: ResponseData = {
        error: null,
        data: { token },
        message: 'success',
        statusCode: 201,
      };

      return res.status(201).send(responseData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(AuthRouter.ME)
  async me(@Res() res: Response, @Request() req) {
    try {
      const responseData: ResponseData = {
        error: null,
        data: req.user,
        message: 'success',
        statusCode: 200,
      };

      return res.status(201).send(responseData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(AuthRouter.LOGOUT)
  async logout(@Res() res: Response, @Request() req) {
    try {
      res.clearCookie(COOKIE_AUTH_TOKEN);

      const responseData: ResponseData = {
        error: null,
        data: req.user,
        message: 'success',
        statusCode: 200,
      };

      return res.status(201).send(responseData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
