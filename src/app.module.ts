import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from './config/redis.config.service';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: TypeOrmConfigService,
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useClass: RedisConfigService,
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
        }),
        UserModule,
        ArticleModule,
        CacheModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
