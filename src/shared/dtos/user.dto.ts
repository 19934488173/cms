import { IsString, Validate } from 'class-validator';
import {
  IsOptionalString,
  IsOptionalEmail,
  IsOptionalNumber,
  IsOptionalBoolean,
} from '../decorators/validation-and-transform.decorators';
import {
  IsUsernameUnique,
  StartsWithConstraint,
} from '../validators/user-validators';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名，必须唯一且以指定前缀开头',
    example: 'user_john',
  })
  @IsString()
  @Validate(StartsWithConstraint, ['user_'])
  @IsUsernameUnique({ message: '用户名已存在' })
  readonly username: string;

  @ApiProperty({ description: '密码', example: 'securePassword123' })
  @IsString()
  readonly password: string;

  @ApiPropertyOptional({ description: '手机号', example: '1234567890' })
  @IsOptionalString()
  readonly mobile?: string;

  @ApiPropertyOptional({
    description: '邮箱地址',
    example: 'john.doe@example.com',
  })
  @IsOptionalEmail()
  readonly email?: string;

  @ApiPropertyOptional({ description: '用户状态', example: 1 })
  @IsOptionalNumber()
  readonly status?: number;

  @ApiPropertyOptional({ description: '是否为超级管理员', example: true })
  @IsOptionalBoolean()
  readonly is_super?: boolean;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsOptionalNumber()
  readonly id: number;
}
