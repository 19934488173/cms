import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
@ValidatorConstraint({ name: 'startsWith', async: false })
export class StartsWithConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const { constraints } = validationArguments;
    return value.startsWith(constraints[0]);
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { property, constraints } = validationArguments;
    return `${property} must start with ${constraints[0]}`;
  }
}
@Injectable()
@ValidatorConstraint({ name: 'IsUsernameUnique', async: true })
export class IsUsernameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}
  async validate(value: any) {
    const user = await this.repository.findOne({ where: { username: value } });
    return !user;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { property, value } = validationArguments;
    return `${property} ${value} 已经被使用！`;
  }
}
