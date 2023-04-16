import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';
import { signinUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'src/entities/users.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('/api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 로그인 유무
    @UseGuards(AuthGuard)
    @Get('/isLoggedIn')
    async isLoggedIn(@Req() req) {
        const { isLoggedIn, userInfo } = req.auth;

        return { isLoggedIn, userInfo };
    }

    @Get('/:userId')
    async getUser(@Param('userId') userId: number): Promise<Users> {
        return await this.userService.getUser(userId);
    }

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

    @Patch('/:userId')
    async updateUser(
        @Param('userId') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<{ message: string }> {
        await this.userService.updateUser(userId, updateUserDto);
        return { message: '수정 되었습니다.' };
    }
}
