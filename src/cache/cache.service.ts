import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async setRefreshToken(userId: number, refreshToken: string) {
        await this.redis.set(
            `refreshToken-${userId}`,
            refreshToken,
            'EX',
            86400,
        );
    }
}
