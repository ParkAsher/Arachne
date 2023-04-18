/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDummy } from '../../test/dummy/user.dummy';
import { CacheService } from 'src/cache/cache.service';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        findOne: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
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

    describe('유저 상세정보 가져오기', () => {
        it('repository로 인자 전달 제대로 하는지', () => {
            // Givne
            const userId: number = 1;

            // When
            userService.getUser(userId);

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
        it('repository로 인자 전달 제대로 하는지', () => {
            // Given
            const updateUserDto: UpdateUserDto = {
                nickname: 'updateNickname',
                profileImg: 'updateImg',
                email: 'updateEmail@email.com',
                phone: '01099999999',
            };
            const userId = UserDummy[0].userId;

            // When
            userService.updateUser(userId, updateUserDto);

            // Then
            expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                userId,
                updateUserDto,
            );
        });
    });

    describe('회원 탈퇴', () => {
        it('repository로 인자 전달 제대로 하는지', async () => {
            // Given
            const userId: number = UserDummy[0].userId;

            // When
            await userService.withdraw(userId);

            // Then
            expect(mockUserRepository.softDelete).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId);
        });
    });
});
