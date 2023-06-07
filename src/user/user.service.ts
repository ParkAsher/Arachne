import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { signupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { signinUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from 'src/cache/cache.service';
import { BackUpdateUserDto } from './dto/back-update-user.dto';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';
import { FindUserIdDto } from './dto/find-user-id.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
        private jwtService: JwtService,
        private cacheService: CacheService,
    ) {}

    async findUser(id: string) {
        try {
            return await this.userRepository.findOne({
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserByUserId(userId: number): Promise<Users> {
        const userInfo = await this.userRepository.findOne({
            select: [
                'id',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',
            ],
            where: { userId },
        });

        return userInfo;
    }

    // 비밀번호 가져오기
    async findUserPasswordByUserId(userId: number): Promise<Users> {
        return await this.userRepository.findOne({
            select: ['password'],
            where: { userId },
        });
    }

    async findExistUser(column) {
        try {
            return await this.userRepository.count({
                where: { ...column },
            });
        } catch (error) {
            throw error;
        }
    }

    async signUpUser(userInfo: signupUserDto) {
        try {
            const duplicatedCheckArray = [
                { id: userInfo.id },
                { email: userInfo.email },
                { phone: userInfo.phone },
                { nickname: userInfo.nickname },
            ];

            for (let column of duplicatedCheckArray) {
                const count = await this.findExistUser(column);

                if (count) {
                    throw new HttpException(
                        Object.keys(column)[0],
                        HttpStatus.CONFLICT,
                    );
                }
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(userInfo.password, 10);
            userInfo.password = hashedPassword;

            await this.userRepository.save(userInfo);
        } catch (error) {
            throw error;
        }
    }

    /** userId(Primary key)를 가진 데이터 softDelete.
     * @param userId
     * @returns void
     */
    async withdraw(userId: number): Promise<void> {
        try {
            await this.userRepository.delete(userId);
        } catch (error) {
            throw error;
        }
    }

    async signInUser(userInfo: signinUserDto) {
        try {
            const user = await this.findUser(userInfo.id);

            if (!user) {
                throw new UnauthorizedException(
                    '아이디 혹은 비밀번호가 일치하지 않습니다.',
                );
            }

            // 입력받은 비밀번호, DB에 저장된 비밀번호 비교
            const compare = await bcrypt.compare(
                userInfo.password,
                user.password,
            );

            if (!compare) {
                throw new UnauthorizedException(
                    '아이디 혹은 비밀번호가 일치하지 않습니다.',
                );
            }

            // access token 생성
            const accessToken = await this.createAccessToken(user.userId);

            // refresh token 생성
            const refreshToken = await this.createRefreshToken();

            // refresh token Redis 저장
            await this.cacheService.setRefreshToken(user.userId, refreshToken);

            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }

    async createAccessToken(userId: number) {
        const payload = { userId };

        return await this.jwtService.signAsync(payload, {
            expiresIn: '1m',
        });
    }

    async createRefreshToken() {
        return await this.jwtService.signAsync(
            {},
            {
                expiresIn: '1d',
            },
        );
    }

    // 회원 프로필 이미지 수정
    async updateUserProfileImage(userId: number, profileImagePath: string) {
        try {
            this.userRepository.update(userId, {
                profileImg: profileImagePath,
            });
        } catch (error) {
            throw error;
        }
    }

    // 회원 정보 수정
    async updateUserProfile(userId: number, userInfo: UpdateUserDto) {
        try {
            // 닉네임, 이메일 중복검사
            const duplicatedCheckArray = [
                { nickname: userInfo.nickname },
                { email: userInfo.email },
            ];

            for (const column of duplicatedCheckArray) {
                const count = await this.findExistUser(column);

                if (count) {
                    throw new ConflictException(Object.keys(column)[0]);
                }
            }

            await this.userRepository.update(userId, { ...userInfo });
        } catch (error) {
            throw error;
        }
    }

    // 회원 비밀번호 변경
    async updateUserPassword(userId: number, passwordInfo) {
        const { currentPassword, newPassword } = passwordInfo;

        const { password } = await this.findUserPasswordByUserId(userId);

        // 현재 비밀번호, DB에 저장된 비밀번호 비교
        const compare = await bcrypt.compare(currentPassword, password);

        if (!compare) {
            throw new UnauthorizedException(
                '현재 비밀번호가 일치하지 않습니다.',
            );
        }

        // 비밀번호 암호화
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        try {
            await this.userRepository.update(userId, {
                password: hashedNewPassword,
            });
        } catch (error) {
            throw error;
        }
    }

    // 백오피스 - 전체 유저 조회
    async getAllUser(): Promise<Users[]> {
        return await this.userRepository.find({
            select: [
                'userId',
                'id',
                'password',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',
            ],
        });
    }

    // 백오피스 - 유저 조회 (모든 정보)
    async getUserById(userId: number): Promise<Users> {
        return await this.userRepository.findOne({
            select: [
                'id',
                'password',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',
            ],
            where: { userId },
        });
    }

    // 백오피스 - 유저 삭제
    async deleteUser(userIdList: string): Promise<void> {
        try {
            const arr = userIdList.split(',');

            for (let i = 0; i < arr.length; i++) {
                const userId = Number(arr[i]);
                await this.userRepository.delete(userId);
            }
        } catch (error) {
            throw error;
        }
    }

    // 백오피스 - 유저 정보 수정
    // <Todo> 중복성체크
    async adminUpdateUserProfile(
        userId: number,
        userInfo: BackUpdateUserDto,
    ): Promise<void> {
        try {
            if (userInfo.password) {
                // 비밀번호 암호화
                const hashedPassword = await bcrypt.hash(userInfo.password, 10);
                userInfo.password = hashedPassword;
            }

            await this.userRepository.update(userId, { ...userInfo });
        } catch (error) {
            throw error;
        }
    }

    // 백오피스 - 회원 가입 승인
    async acceptUser(userId: number): Promise<void> {
        try {
            await this.userRepository.update(userId, { role: 2 });
        } catch (error) {
            throw error;
        }
    }
    // 비밀번호 찾기 - payload와 일치하는 유저가 있는지 체크
    async checkUserForFindPassword(
        resetPasswordRequestDto: PasswordResetRequestDto,
    ) {
        const { email, id, name } = resetPasswordRequestDto;

        const user = await this.userRepository.findOne({
            select: ['id'],
            where: { email, id, name },
        });

        if (!user) {
            throw new NotFoundException('유저 정보가 존재하지 않습니다.');
        }

        return { message: '유저 정보가 확인되었습니다.' };
    }

    // 아이디 찾기 - 이름과 이메일이 일치하는 유저의 ID를 출력
    async checkUserForFindId(findUserIdDto: FindUserIdDto) {
        const { email, name } = findUserIdDto;

        const user = await this.userRepository.findOne({
            where: {
                email: email,
                name: name,
            },
            select: ['id'],
        });

        if (!user) {
            throw new NotFoundException('유저 정보가 존재하지 않습니다.');
        }

        return user;
    }
}
