import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import RouterUrl from 'src/common/constant/router';
import { ResponseData } from 'src/common/interface';
import { BodyValidationPipe } from 'src/common/pipe/body-validation.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller(RouterUrl.USER.ROOT)
export class UserController {
  constructor(private usersService: UserService) {}

  @Post(RouterUrl.USER.CREATE)
  async createUser(
    @Body(new BodyValidationPipe()) payload: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.create(payload);

      const responseData: ResponseData = {
        message: 'success',
        data: user,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(RouterUrl.USER.UPDATE)
  async updateUser(
    @Body(new BodyValidationPipe()) payload: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.params;

      const user = await this.usersService.update(id, payload);

      const responseData: ResponseData = {
        message: 'success',
        data: user,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(RouterUrl.USER.LIST)
  async listUser(@Res() res: Response) {
    try {
      const user = await this.usersService.listAndCount({});

      const responseData: ResponseData = {
        message: 'success',
        data: { list_user: user[0], total: user[1] },
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(RouterUrl.USER.RETRIEVE)
  async getUser(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;

      const user = await this.usersService.retrieveById(id);

      const responseData: ResponseData = {
        message: 'success',
        data: user,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(RouterUrl.USER.DELETE)
  async deleteUser(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;

      const user = await this.usersService.delete(id);

      const responseData: ResponseData = {
        message: 'success',
        data: user,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
