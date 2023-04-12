import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/signup')
    async signUp(@Body() userInfo: signupUserDto) {
        return await this.userService.signUpUser(userInfo);
    }
}
