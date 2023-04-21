import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';
import { signinUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'src/entities/users.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CacheService } from 'src/cache/cache.service';

@Controller('/api/users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cacheService: CacheService,
    ) {}

    // 로그인 유무
    @UseGuards(AuthGuard)
    @Get('/isLoggedIn')
    async isLoggedIn(@Req() req) {
        const { isLoggedIn, userInfo } = req.auth;

        return { isLoggedIn, userInfo };
    }

    // 로그아웃
    @UseGuards(AuthGuard)
    @Get('/signout')
    async signOut(@Req() req, @Res() res) {
        const { isLoggedIn, userInfo } = req.auth;

        // 이미 로그아웃 상태라면 불가능한 기능
        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        // Access Token, Refresh Token 다 지우기
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // Redis Refresh Token 지우기
        await this.cacheService.removeRefreshToken(userInfo.userId);

        return res.send();
    }

    // 회원 가입
    @Post('/signup')
    async signUp(@Body() userInfo: signupUserDto) {
        return await this.userService.signUpUser(userInfo);
    }

    // 회원 탈퇴
    @UseGuards(AuthGuard)
    @Delete('/:userId')
    async withdraw(
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req,
        @Res() res,
    ) {
        const { isLoggedIn, userInfo } = req.auth;
        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        if (userInfo.role !== 1) {
            if (userId !== req.auth.userInfo.userId) {
                throw new UnauthorizedException('잘못된 접근입니다.');
            }
        }

        await this.userService.withdraw(userId);

        // Access Token, Refresh Token 다 지우기
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // Redis Refresh Token 지우기
        await this.cacheService.removeRefreshToken(userId);

        return res.send();
    }

    // 로그인
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

    // 마이페이지 유저정보 조회
    @Get('/:userId')
    async getUser(@Param('userId') userId: number): Promise<Users> {
        return await this.userService.getUser(userId);
    }

    // 유저정보 수정
    @Patch('/:userId')
    async updateUser(
        @Param('userId') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<{ message: string }> {
        await this.userService.updateUser(userId, updateUserDto);
        return { message: '수정 되었습니다.' };
    }

    // 모든 회원 정보 불러오기
    @Get('/')
    async getAllUser(): Promise<Users[]> {
        return await this.userService.getAllUser();
    }
}
