/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDummy } from '../../test/dummy/user.dummy';
import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';

describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    };

    const mockUserCacheService = {};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(Users),
                    useValue: mockUserRepository,
                },
                JwtService,
                CacheService,
            ],
        })
            .overrideProvider(CacheService)
            .useValue(mockUserCacheService)
            .compile();

        userService = module.get<UserService>(UserService);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    describe('유저 상세정보 가져오기', () => {
        it('user.repository.update 호출 제대로 하는지', async () => {
            // Givne
            const userId: number = UserDummy[0].userId;

            // When
            await userService.findUserByUserId(userId);

            // Then
            expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
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
        });
    });

    describe('유저 정보 업데이트', () => {
        it('user.repository.update 호출 제대로 하는지', async () => {
            // Given
            const userInfo: UpdateUserDto = {
                nickname: 'updateNickname',
                email: 'updateEmail@email.com',
            };
            const userId = UserDummy[0].userId;

            // When
            await userService.updateUserProfile(userId, userInfo);

            // Then
            expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
                ...userInfo,
            });
        });
    });

    describe('회원 탈퇴', () => {
        it('user.repository.signUpUser 호출 제대로 하는지', async () => {
            // Given
            const userId: number = UserDummy[0].userId;

            // When
            await userService.withdraw(userId);

            // Then
            expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
        });
    });

    describe('비밀번호 찾기', () => {
        it('user.repository.findOne 호출 제대로 하는지', async () => {
            // Given
            const passwordResetRequestDto: PasswordResetRequestDto = {
                email: UserDummy[0].email,
                id: UserDummy[0].id,
                name: UserDummy[0].name,
            };

            // When
            await userService.checkUserForFindPassword(passwordResetRequestDto);

            // Then
            expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                select: ['id'],
                where: {
                    email: passwordResetRequestDto.email,
                    id: passwordResetRequestDto.id,
                    name: passwordResetRequestDto.name,
                },
            });
        });
    });
});
