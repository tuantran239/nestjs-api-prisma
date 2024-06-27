import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { validate } from "class-validator";
import { I18nCustomService } from "src/i18n-custom/i18n-custom.service";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export const checkBodyValid = async (
    metadata: any,
    payload: Record<string, any>,
    i18n: I18nCustomService,
  ) => {
    const keys = Object.keys(payload);
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      metadata[key] = payload[key];
    }
  
    const errors = await validate(metadata);
  
    let validation_error = '';
  
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      validation_error += Object.keys(error.constraints ?? {})
        .map((key) =>
          i18n.getMessage(error.constraints[key].split('|')[0] as any),
        )
        .join(',');
  
      if (i !== errors.length - 1) {
        validation_error += ',';
      }
    }
  
    if (errors.length > 0) {
      throw new BadRequestException(
        validation_error.length > 0 ? validation_error : 'Validation failed',
      );
    }
  };
  
  export const checkRoleValid = (
    requiredRoles: string[],
    user: UserResponseDto,
  ) => {
    if (!requiredRoles) {
      return true;
    }
  
    const isAuthorization = requiredRoles.some((role) => user.role.code === role);
  
    if (!isAuthorization) {
      throw new ForbiddenException('Access denied');
    }
  
    return true;
  };