import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';
import { signinUserDto } from './dto/signin-user.dto';

@Controller('/api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/signup')
    async signUp(@Body() userInfo: signupUserDto) {
        return await this.userService.signUpUser(userInfo);
    }

    @Post('/signin')
    async signIn(@Body() userInfo: signinUserDto, @Res() res) {
        const { accessToken, refreshToken } = await this.userService.signInUser(
            userInfo,
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });

        return res.send();
    }
}
