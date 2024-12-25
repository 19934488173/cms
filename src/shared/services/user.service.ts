import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, Like, In } from 'typeorm';
import { MySQLBaseService } from './mysql-base.service';
import { Role } from '../entities/role.entity';
import { UpdateUserRolesDto } from '../dtos/user.dto';
@Injectable()
export class UserService extends MySQLBaseService<User> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
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

  async updateRoles(id: number, updateUserRolesDto: UpdateUserRolesDto) {
    const user = await this.repository.findOneBy({ id });
    user.roles = await this.roleRepository.findBy({
      id: In(updateUserRolesDto.roleIds),
    });
    await this.repository.save(user);
  }
}
