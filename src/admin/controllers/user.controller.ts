import {
  Get,
  Post,
  Controller,
  Render,
  Redirect,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Res,
  Delete,
  Headers,
  UseFilters,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/shared/services/user.service';
import { UtilityService } from 'src/shared/services/utility.service';
import { Response } from 'express';
import { CreateUserDto, UpdateUserDto } from 'src/shared/dtos/user.dto';
import { AdminExceptionFilter } from '../filters/admin-exception.filter';
import { ParseOptionalIntPipe } from 'src/shared/pipes/parse-optional-int.pipe';
@UseFilters(AdminExceptionFilter)
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
  ) {}
  @Get()
  @Render('user/user-list')
  async findAll(
    @Query('keyword') keyword: string = '',
    @Query('page', new ParseOptionalIntPipe(1)) page: number,
    @Query('limit', new ParseOptionalIntPipe(10)) limit: number,
  ) {
    const { users, total } = await this.userService.findAllWithPagination(
      page,
      limit,
      keyword,
    );
    const pageCount = Math.ceil(total / limit);
    return { users, keyword, total, page, limit, pageCount };
  }

  @Get('create')
  @Render('user/user-form')
  createForm() {
    return { user: {} };
  }

  @Post()
  @Redirect('/admin/users')
  async create(@Body() createUserDto: CreateUserDto) {
    createUserDto.password = await this.utilityService.hashPassword(
      createUserDto.password,
    );
    await this.userService.create(createUserDto);
    return { success: true };
  }

  @Get(':id/edit')
  @Render('user/user-form')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return { user };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
    @Headers('accept') accept: string,
  ) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.utilityService.hashPassword(
        updateUserDto.password,
      );
    } else {
      delete updateUserDto.password;
    }
    await this.userService.update(id, updateUserDto);
    if (accept === 'application/json') {
      return res.json({ success: true });
    } else {
      return res.redirect('/admin/users');
    }
  }

  @Get(':id')
  @Render('user/user-detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return { user };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.userService.delete(id);
    return { success: true };
  }
}
