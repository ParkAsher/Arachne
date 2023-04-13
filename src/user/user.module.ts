import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        RedisModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
