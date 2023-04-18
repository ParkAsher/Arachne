import { Controller, Get, Render, UseGuards } from '@nestjs/common';
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

    @UseGuards(AuthGuard)
    @Get('mypage')
    @Render('index')
    mypage() {
        return { component: 'mypage' };
    }
}
