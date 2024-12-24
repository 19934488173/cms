import {
  ApiProperty,
  PartialType as PartialTypeFromSwagger,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import {
  IdValidators,
  StatusValidators,
  SortValidators,
} from '../decorators/dto.decorator';

export enum AccessType {
  MODULE = 'module',
  MENU = 'menu',
  FEATURE = 'feature',
}
export class CreateAccessDto {
  @IsString()
  @ApiProperty({ description: '名称', example: 'name' })
  name: string;

  @ApiProperty({ description: '类型', example: 'type' })
  @IsString()
  type: AccessType;

  @IsString()
  @ApiProperty({ description: 'url地址', example: '/admin/users' })
  url: string;

  @StatusValidators()
  @ApiProperty({ description: '父权限id', example: '1' })
  parentId: number;

  @IsString()
  @ApiProperty({ description: '描述', example: '用户管理' })
  description: string;

  @StatusValidators()
  @ApiProperty({ description: '状态', example: 1 })
  status: number;

  @SortValidators()
  @ApiProperty({ description: '排序号', example: 100 })
  sort: number;
}

export class UpdateAccessDto extends PartialTypeFromSwagger(
  PartialType(CreateAccessDto),
) {
  @IdValidators()
  id: number;
}
