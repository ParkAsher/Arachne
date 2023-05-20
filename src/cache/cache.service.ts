import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CheckAuthCodeDto } from 'src/auth/dto/check-auth-code.dto';

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

    async setAuthCode(email: string, authCode: number): Promise<void> {
        await this.redis.set(email, authCode, 'EX', 180);
    }

    async removeAuthCode({
        email,
        authCode,
    }: CheckAuthCodeDto): Promise<boolean> {
        const getAuthCode: string | false = await this.getValueByKeyInRedis(
            email,
        );

        if (!getAuthCode) {
            throw new UnauthorizedException('3분이 지났습니다!');
        }

        const isAuthentication: boolean =
            authCode === parseInt(getAuthCode, 10);

        if (!isAuthentication) {
            throw new UnauthorizedException('인증코드가 틀립니다!');
        }

        this.redis.del(email);
        return true;
    }

    private async getValueByKeyInRedis(key: string): Promise<string | false> {
        const value = await this.redis.get(key);
        if (!value) {
            return false;
        }
        return value;
    }
}
