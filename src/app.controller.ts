import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

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
    @Render('adminindex')
    admin() {
        return { component: 'adminmain' };
    }

    @Get('/admin/user')
    @Render('adminindex')
    adminuser() {
        return { component: 'adminuser' };
    }
}
