import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { CacheModule } from 'src/cache/cache.module';
import { AuthController } from './auth.controller';
import { MailModule } from 'src/mail/mail.module';
import { Comments } from 'src/entities/comments.entity';
import { Articles } from 'src/entities/articles.entity';
import { Categories } from 'src/entities/categories.entity';
import { Likes } from 'src/entities/likes.entity';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            Users,
            Comments,
            Articles,
            Categories,
            Likes,
        ]),
        CacheModule,
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
