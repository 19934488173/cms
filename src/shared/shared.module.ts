import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './services/configuration.service';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UtilityService } from './services/utility.service';
import { IsUsernameUniqueConstraint } from './validators/user-validators';
import { Role } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { Access } from './entities/access.entity';
import { AccessService } from './services/access.service';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => ({
        type: 'mysql',
        ...configurationService.mysqlConfig,
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
      }),
    }),
    //注册特定实体（如 User）的 Repository，用于操作对应的数据库表
    TypeOrmModule.forFeature([User, Role, Access]),
  ],
  providers: [
    ConfigurationService,
    UserService,
    UtilityService,
    IsUsernameUniqueConstraint,
    RoleService,
    AccessService,
  ],
  exports: [
    ConfigurationService,
    UserService,
    UtilityService,
    IsUsernameUniqueConstraint,
    RoleService,
    AccessService,
  ],
})
export class SharedModule {}
