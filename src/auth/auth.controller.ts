import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendAuthCodeDto } from './dto/send-auth-code.dto';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 인증메일 보내기
    @Post('/send-auth-code')
    async sendAuthCode(@Body() { email }: SendAuthCodeDto) {
        await this.authService.sendAuthCode(email);
    }

    // 인증번호 확인
    @Post('/check-auth-code')
    async checkAuthCode(
        @Body() checkAuthCodeDto: CheckAuthCodeDto,
    ): Promise<boolean> {
        return await this.authService.checkAuthCode(checkAuthCodeDto);
    }
}
