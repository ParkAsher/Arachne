import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { Users } from 'src/entities/users.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private cacheService: CacheService,
        private readonly mailService: MailService,
    ) {}

    // Token 검증
    async validateToken(token: string): Promise<boolean> {
        try {
            await this.jwtService.verify(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Access Token 재발급
    async createAccessToken(userId: number) {
        const payload = { userId };

        return await this.jwtService.signAsync(payload, {
            expiresIn: '1m',
        });
    }

    // 인증메일 보내기
    async sendAuthCode(email: string) {
        const authCode: number = await this.mailService.sendAuthCode(email);

        await this.cacheService.setAuthCode(email, authCode);
    }

    // 인증번호 확인
    async checkAuthCode(checkAuthCodeDto: CheckAuthCodeDto): Promise<boolean> {
        const getAuthCode: string | false =
            await this.cacheService.getValueByKeyInRedis(
                checkAuthCodeDto.email,
            );

        if (!getAuthCode) {
            throw new UnauthorizedException('3분이 지났습니다!');
        }

        const isAuthentication: boolean =
            checkAuthCodeDto.authCode === parseInt(getAuthCode, 10);

        if (!isAuthentication) {
            throw new UnauthorizedException('인증코드가 틀립니다!');
        }

        return await this.cacheService.removeAuthCode(checkAuthCodeDto);
    }
}
