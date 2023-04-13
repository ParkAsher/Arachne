/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';

describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(Users),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    describe('유저 상세정보 가져오기', () => {
        it('repository로 인자 전달 제대로 하는지', async () => {
            // Givne
            const userId: number = 1;

            // When
            await userService.getUser(userId);

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
});
