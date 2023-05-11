import {
    Controller,
    Get,
    Render,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('index')
    index() {
        return { component: 'main' };
    }

    @Get('signup')
    @Render('index')
    signup() {
        return { component: 'signup' };
    }

    @Get('signin')
    @Render('index')
    signin() {
        return { component: 'signin' };
    }

    @Get('admin')
    @Render('admin-index')
    admin() {
        return { component: 'adminMain' };
    }

    @Get('/admin/user')
    @Render('admin-index')
    adminUser() {
        return { component: 'adminUser' };
    }

    @UseGuards(AuthGuard)
    @Get('mypage')
    @Render('index')
    mypage(@Req() req) {
        const { isLoggedIn } = req.auth;

        // 로그인이 되지 않은 상태에서 들어올 수 없는 페이지
        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        return { component: 'mypage' };
    }

    @UseGuards(AuthGuard)
    @Get('password-change')
    @Render('index')
    passwordChange(@Req() req) {
        const { isLoggedIn } = req.auth;

        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        return { component: 'passwordChange' };
    }
}
