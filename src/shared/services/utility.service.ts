import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilityService {
  // 定义一个异步方法，用于生成密码的哈希值
  async hashPassword(password: string): Promise<string> {
    // 生成一个盐值，用于增强哈希的安全性
    const salt = await bcrypt.genSalt();
    // 使用 bcrypt 库生成密码的哈希值
    return bcrypt.hash(password, salt);
  }

  // 定义一个异步方法，用于验证密码是否匹配
  async comparePassword(password: string, hash: string): Promise<boolean> {
    // 使用 bcrypt 库验证密码是否匹配
    return bcrypt.compare(password, hash);
  }
}
