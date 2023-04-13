import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { signupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'src/entities/users.entity';

@Controller('/api/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/:userId')
    async getUser(@Param('userId') userId: number): Promise<Users> {
        return await this.userService.getUser(userId);
    }

    @Post('/signup')
    async signUp(@Body() userInfo: signupUserDto) {
        return await this.userService.signUpUser(userInfo);
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
