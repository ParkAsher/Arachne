import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
import { Users } from 'src/entities/users.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

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

    async sendAuthCode(email: string) {
        const authCode = await this.mailService.sendAuthCode(email);

        await this.cacheService.setAuthCode(email, authCode);
    }

    async checkAuthCode(email: string) {}
}
