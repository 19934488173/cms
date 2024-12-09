import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  MinLength,
  MaxLength,
  Validate,
  IsNotEmpty,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IdValidators,
  SortValidators,
  StatusValidators,
} from '../decorators/dto.decorator';
import {
  IsUsernameUniqueConstraint,
  StartsWithConstraint,
} from '../validators/user-validators';
export class CreateUserDto {
  @Validate(StartsWithConstraint, ['user_'])
  @Validate(IsUsernameUniqueConstraint)
  @ApiProperty({ description: '用户名', example: 'nick' })
  username: string;

  @PasswordValidators()
  @ApiProperty({ description: '密码', example: '666666' })
  password: string;
  @MobileValidators()
  @ApiProperty({ description: '手机号', example: '15788888888' })
  @ApiPropertyOptional()
  mobile: string;
  @EmailValidators()
  @ApiProperty({ description: '邮件', example: 'nick@qq.com' })
  email: string;
  @StatusValidators()
  @ApiProperty({ description: '状态', example: 1 })
  status: number;
  @IsSuperValidators()
  @ApiProperty({ description: '是否超级管理员', example: true })
  is_super: boolean;
  @SortValidators()
  @ApiProperty({ description: '排序号', example: 100 })
  sort: number;
}
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'username',
  'password',
]) {
  @IdValidators()
  id: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '用户名', example: 'nick' })
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '密码', example: '666666' })
  password: string;
}
function PasswordValidators() {
  return applyDecorators(
    IsString(),
    IsNotEmpty({
      message: i18nValidationMessage('validation.isNotEmpty', {
        field: 'password',
      }),
    }),
    MinLength(6, {
      message: i18nValidationMessage('validation.minLength', {
        field: 'password',
        length: 6,
      }),
    }),
    MaxLength(8, {
      message: i18nValidationMessage('validation.maxLength', {
        field: 'password',
        length: 8,
      }),
    }),
  );
}
function EmailValidators() {
  return applyDecorators(IsEmail(), IsOptional());
}
function MobileValidators() {
  return applyDecorators(IsString(), IsOptional());
}
function IsSuperValidators() {
  return applyDecorators(
    IsBoolean(),
    IsOptional(),
    Type(() => Boolean),
  );
}
