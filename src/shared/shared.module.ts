import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './services/configuration.service';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
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
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ConfigurationService, UserService],
  exports: [ConfigurationService, UserService],
})
export class SharedModule {}
