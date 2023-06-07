import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisConfigService } from 'src/config/redis.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useClass: RedisConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
