import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { UserService } from 'src/shared/services/user.service';
import { Result } from 'src/shared/vo/result';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //查询所有用户
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  //根据id查询某个用户
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne({ where: { id } });
  }

  // 创建新用户
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  //更新用户信息
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updateResult = await this.userService.update(id, updateUserDto);
    const { affected } = updateResult;
    if (affected === 0) {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    } else {
      return Result.success('用户信息更新成功');
    }
  }

  //删除用户
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleteResult = await this.userService.delete(id);
    const { affected } = deleteResult;
    if (affected === 0) {
      throw new HttpException('用户未找到', HttpStatus.NOT_FOUND);
    } else {
      return Result.success('删除用户成功');
    }
  }
}
