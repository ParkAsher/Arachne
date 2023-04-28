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
        const { isLoggedIn, userId } = req.auth;

        if (!isLoggedIn) {
            return { isLoggedIn, userInfo: null };
        }

        const userInfo = await this.userService.findUserByUserId(userId);

        return { isLoggedIn, userInfo };
    }

    // 로그아웃
    @UseGuards(AuthGuard)
    @Get('/signout')
    async signOut(@Req() req, @Res() res) {
        const { isLoggedIn, userId } = req.auth;

        // 이미 로그아웃 상태라면 불가능한 기능
        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        // Access Token, Refresh Token 다 지우기
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // Redis Refresh Token 지우기
        await this.cacheService.removeRefreshToken(userId);

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

    // 마이페이지 회원 정보 가져오기
    @UseGuards(AuthGuard)
    @Get('/')
    async getUser(@Req() req): Promise<Users> {
        const { isLoggedIn, userId } = req.auth;

        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        return await this.userService.findUserByUserId(userId);
    }

    // 마이페이지 회원 정보 수정
    @UseGuards(AuthGuard)
    @Patch('/')
    async updateUser(@Body() userInfo: UpdateUserDto, @Req() req) {
        const { isLoggedIn, userId } = req.auth;

        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        return await this.userService.updateUserProfile(userId, userInfo);
    }
}
