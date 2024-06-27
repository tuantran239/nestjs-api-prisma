import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { BaseRouterUrl } from '../constant/router';
import { ResponseData } from '../interface';
import { BaseRepository } from '../repository/base.repository';
import { BaseService } from '../service/base.service';
import { checkBodyValid } from '../utils/validate';

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
    protected service: S,
    protected repository: CR,
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

  @Post(BaseRouterUrl.CREATE)
  public async create(
    @Body() payload: C,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const me = req.user as UserResponseDto;

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


  @Put(BaseRouterUrl.UPDATE)
  async update(@Body() payload: U, @Req() req: Request, @Res() res: Response) {
    try {
      const me = req.user as UserResponseDto;

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


  @Get(BaseRouterUrl.LIST)
  async list(@Req() req: Request, @Res() res: Response) {
    try {

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

  
  @Get(BaseRouterUrl.RETRIEVE)
  async retrieveById(@Req() req: Request, @Res() res: Response) {
    try {

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


  @Put(BaseRouterUrl.REMOVE)
  async remove(@Req() req: Request, @Res() res: Response) {
    try {

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

  @Delete(BaseRouterUrl.DELETE)
  async delete(@Req() req: Request, @Res() res: Response) {
    try {
      
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
