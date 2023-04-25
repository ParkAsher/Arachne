import {
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

    async findExistUser(column) {
        try {
            return await this.userRepository.find({
                select: ['id'],
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
                const duplicatedUser = await this.findExistUser(column);

                if (duplicatedUser.length) {
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
            await this.userRepository.softDelete(userId);
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

    /** userId(Primary key)의 유저정보를 반환
     * @param userId
     * @returns ['id',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',]
     */
    async getUser(userId: number): Promise<Users> {
        try {
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
        } catch (error) {
            throw error;
        }
    }

    /** userId(Primary key)를 가진 유저의 정보를 updateUserDto의 정보로 수정
     * @param userId
     * @param updateUserDto
     * @returns void
     */
    async updateUser(
        userId: number,
        updateUserDto: UpdateUserDto,
    ): Promise<void> {
        try {
            await this.userRepository.update(userId, { ...updateUserDto });
        } catch (error) {
            throw error;
        }
    }

    // 백오피스 - 전체 유저 조회
    async getAllUser(): Promise<Users[]> {
        return await this.userRepository.find({
            select: [
                'id',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',
            ],
        });
    }

    // 백오피스 - 유저 삭제
    async deleteUser(userId: number): Promise<void> {
        try {
            await this.userRepository.softDelete(userId);
        } catch (error) {
            throw error;
        }
    }
}
