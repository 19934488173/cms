import { IsString, Validate } from 'class-validator';
import {
  IsOptionalString,
  IsOptionalEmail,
  IsOptionalNumber,
  IsOptionalBoolean,
  PasswordValidators,
} from '../decorators/validation-and-transform.decorators';
import {
  IsUsernameUniqueConstraint,
  StartsWithConstraint,
} from '../validators/user-validators';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @Validate(StartsWithConstraint, ['user_'])
  @Validate(IsUsernameUniqueConstraint)
  @ApiProperty({ description: '用户名', example: 'nick' })
  username: string;

  @ApiProperty({ description: '密码', example: 'securePassword123' })
  @IsString()
  @PasswordValidators()
  password: string;

  @ApiPropertyOptional({ description: '手机号', example: '1234567890' })
  @IsOptionalString()
  mobile?: string;

  @ApiPropertyOptional({
    description: '邮箱地址',
    example: 'john.doe@example.com',
  })
  @IsOptionalEmail()
  email?: string;

  @ApiPropertyOptional({ description: '用户状态', example: 1 })
  @IsOptionalNumber()
  status?: number;

  @IsOptionalNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '是否为超级管理员', example: true })
  @IsOptionalBoolean()
  is_super?: boolean;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '用户ID', example: 1 })
  @IsOptionalNumber()
  id: number;
}
