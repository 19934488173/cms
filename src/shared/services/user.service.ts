import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, Like } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';
@Injectable()
export class UserService extends MySQLBaseService<User> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository);
  }
  async findAll(keyword: string = ''): Promise<User[]> {
    const where = keyword
      ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }]
      : {};

    const users = await this.repository.find({
      where,
    });
    return users;
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    keyword: string = '',
  ): Promise<{ users: User[]; total: number }> {
    const where = keyword
      ? [{ username: Like(`%${keyword}%`) }, { email: Like(`%${keyword}%`) }]
      : {};

    const [users, total] = await this.repository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });
    return { users, total };
  }
}
