import {
    Controller,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('/api/uploads')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(AuthGuard)
    @Post('/profile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.MulterS3.File, @Req() req) {
        const { isLoggedIn, userId } = req.auth;

        if (!isLoggedIn) {
            throw new UnauthorizedException('로그인 중이 아닙니다.');
        }

        // S3 프로필 이미지 업로드
        const profileImagePath = await this.uploadService.uploadProfileImage(
            file,
            'profile',
        );

        // 회원 프로필이미지 링크 수정
        this.userService.updateUserProfileImage(userId, profileImagePath);

        return { profileImagePath };
    }

    @Patch('/admin/profile/:userId')
    @UseInterceptors(FileInterceptor('file'))
    async adminUploadFile(
        @UploadedFile() file: Express.MulterS3.File,
        @Param('userId') userId: number,
    ) {
        // S3 프로필 이미지 업로드
        const profileImagePath = await this.uploadService.uploadProfileImage(
            file,
            'profile',
        );

        // 회원 프로필이미지 링크 수정
        this.userService.updateUserProfileImage(userId, profileImagePath);

        return { profileImagePath };
    }
}
