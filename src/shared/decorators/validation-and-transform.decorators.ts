import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
// 可选的字符串装饰器
export function IsOptionalString() {
  return applyDecorators(IsOptional(), IsString());
}
// 可选的邮箱装饰器
export function IsOptionalEmail() {
  return applyDecorators(IsOptional(), IsEmail());
}
// 可选的数字装饰器，并转换类型为 Number
export function IsOptionalNumber() {
  return applyDecorators(
    IsOptional(),
    IsNumber(),
    Type(() => Number),
  );
}
// 可选的布尔值装饰器，并转换类型为 Boolean
export function IsOptionalBoolean() {
  return applyDecorators(
    IsOptional(),
    IsBoolean(),
    Type(() => Boolean),
  );
}

export function PasswordValidators() {
  return applyDecorators(
    IsString(),
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
