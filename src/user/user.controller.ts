import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/:userId')
    async getUser(@Param('userId') userId: number) {
        return await this.userService.getUser(userId);
    }

    @Post('/signup')
    async signUp(@Body() userInfo: signupUserDto) {
        return await this.userService.signUpUser(userInfo);
    }
}
