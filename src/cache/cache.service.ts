import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async getRefreshToken(userId: number) {
        return await this.redis.get(`refreshToken-${userId}`);
    }

    async setRefreshToken(userId: number, refreshToken: string) {
        await this.redis.set(
            `refreshToken-${userId}`,
            refreshToken,
            'EX',
            86400,
        );
    }

    async removeRefreshToken(userId: number) {
        await this.redis.del(`refreshToken-${userId}`);
    }
}
