import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
    imports: [RedisModule],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
