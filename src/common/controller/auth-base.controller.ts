import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { BaseService } from '../service/base.service';
import { BaseRepository } from '../repository/base.repository';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BaseRouterUrl } from '../constant/router';
import { Request, Response } from 'express';
import { checkBodyValid, checkRoleValid } from '../utils/validate';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { ResponseData } from '../interface';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

@Controller()
export class AuthBaseController<
  PD,
  E,
  C,
  U,
  R,
  LA,
  CA,
  RA,
  Q,
  CR extends BaseRepository<PD, E, C, U, R, LA, CA, RA>,
  S extends BaseService<PD, E, C, U, R, LA, CA, RA, Q, CR>,
> {
  constructor(
    private service: S,
    private repository: CR,
    private readonly _i18n: I18nCustomService,
    private readonly dto: {
      CreateDto: C;
      UpdateDto: U;
      QueryDto: Q;
    },
    private roles: {
      create: string[];
      update: string[];
      list: string[];
      retrieve: string[];
      remove: string[];
      delete: string[];
    },
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(BaseRouterUrl.CREATE)
  public async create(
    @Body() payload: C,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.create, me);

      await checkBodyValid(this.dto.CreateDto, payload, this._i18n);

      const newRecord = await this.service.create({ ...payload, me });

      const responseData: ResponseData = {
        message: 'success',
        data: newRecord,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(BaseRouterUrl.UPDATE)
  async update(@Body() payload: U, @Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.update, me);

      await checkBodyValid(this.dto.UpdateDto, payload, this._i18n);

      const { id } = req.params;

      const updatedRecord = await this.service.update(id, { ...payload, me });

      const responseData: ResponseData = {
        message: 'success',
        data: updatedRecord,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(BaseRouterUrl.LIST)
  async list(@Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.list, me);

      await checkBodyValid(this.dto.QueryDto, req.query as Q, this._i18n);

      const query = req.query as Q;

      const data = await this.service.listByQuery(query);

      const responseData: ResponseData = {
        message: 'success',
        data,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(BaseRouterUrl.RETRIEVE)
  async retrieveById(@Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.retrieve, me);

      const { id } = req.params;

      const options = { where: { id } } as any;

      const record = await this.service.retrieve(options);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(BaseRouterUrl.REMOVE)
  async remove(@Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.remove, me);

      const { id } = req.params;

      const record = await this.service.remove(id);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(BaseRouterUrl.DELETE)
  async delete(@Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

      checkRoleValid(this.roles.delete, me);
      
      const { id } = req.params;

      const record = await this.service.delete(id);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
