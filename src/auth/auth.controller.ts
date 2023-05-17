import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/send-auth-code')
    async sendAuthCode(@Body() { email }: { email: string }) {
        await this.authService.sendAuthCode(email);
    }
}
