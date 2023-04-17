import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
        private cacheService: CacheService,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { accessToken, refreshToken } = request.cookies;

        // Access Token 이나 Refresh Token 이 존재하지 않으면 로그아웃 상태로 간주
        if (!accessToken || !refreshToken) {
            // Cookie Clear
            response.clearCookie('accessToken');
            response.clearCookie('refreshToken');

            request.auth = { isLoggedIn: false, userInfo: null };

            return true;
        }

        // payload 가져오기
        const { userId }: any = await this.jwtService.decode(accessToken);

        // Access Token 검증
        const isValidateAccessToken = await this.authService.validateToken(
            accessToken,
        );

        // Refresh Token 검증
        const isValidateRefreshToken = await this.authService.validateToken(
            refreshToken,
        );

        // Redis 에서 Refresh Token 가져오기
        const redisRefreshToken = await this.cacheService.getRefreshToken(
            userId,
        );

        /*
            [로그아웃 상태로 간주]
            1. Cookie에서 가져온 Refresh Token 이 만료.
            2. Redis 에 Refresh Token 이 존재하지 않음.
            3. Redis 에서 가져온 Refresh Token 과 Cookie 에서 가져온 Refresh Token 이 일치하지 않음.
            
        */
        if (
            !isValidateRefreshToken ||
            !redisRefreshToken ||
            refreshToken !== redisRefreshToken
        ) {
            // Cookie Clear
            response.clearCookie('accessToken');
            response.clearCookie('refreshToken');

            // Redis Refresh Token Clear
            await this.cacheService.removeRefreshToken(userId);

            request.auth = { isLoggedIn: false, userInfo: null };

            return true;
        }

        // Access Token 이 만료
        if (!isValidateAccessToken) {
            // Access Token 재발급
            const newAccessToken = await this.authService.createAccessToken(
                userId,
            );
            // Cookie 저장
            response.cookie('accessToken', newAccessToken, { httpOnly: true });
        }

        // 회원 정보 가져오기
        const userInfo = await this.authService.findUserByUserId(userId);
        userInfo.userId = userId;

        request.auth = { isLoggedIn: true, userInfo };

        return true;
    }
}
