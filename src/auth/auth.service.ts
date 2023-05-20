import { Injectable } from '@nestjs/common';
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
        return await this.cacheService.removeAuthCode(checkAuthCodeDto);
    }
}
