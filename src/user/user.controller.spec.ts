import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as mocks from 'node-mocks-http';
import { signupUserDto } from './dto/signup-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDummy } from '../../test/dummy/user.dummy';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';

describe('UserController', () => {
    let userController: UserController;

    const mockUserService = {
        getUser: jest.fn(),
        signUpUser: jest.fn(),
        updateUser: jest.fn(),
        withdraw: jest.fn(),
    };

    const mockUserCacheService = { removeRefreshToken: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, CacheService],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .overrideProvider(CacheService)
            .useValue(mockUserCacheService)
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate() {
                    return true;
                },
            })
            .compile();

        userController = module.get<UserController>(UserController);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    describe('유저 상세정보 가져오기', () => {
        it('param -> service 전달 제대로 하는지', () => {
            // Given
            const param: number = UserDummy[0].userId;

            // When
            userController.getUser(param);

            // Then
            expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
            expect(mockUserService.getUser).toHaveBeenCalledWith(param);
        });
    });

    describe('회원가입', () => {
        it('dto -> service 전달 제대로 하는지', async () => {
            // Givne
            const userInfo: signupUserDto = {
                id: 'test-id',
                password: '123123',
                email: 'test@test.com',
                phone: '01012341234',
                nickname: 'test-nick',
                name: 'test-name',
            };

            // When
            await userController.signUp(userInfo);

            // Then
            expect(mockUserService.signUpUser).toHaveBeenCalledTimes(1);

            expect(mockUserService.signUpUser).toHaveBeenCalledWith(userInfo);
        });
    });

    describe('유저 정보 업데이트', () => {
        it('service 파라미터 전달 제대로 하는지', () => {
            // Given
            const updateUserDto: UpdateUserDto = {
                nickname: 'updateNickname',
                profileImg: 'updateImg',
                email: 'updateEmail@email.com',
                phone: '01099999999',
            };
            const param: number = UserDummy[0].userId;

            // When
            userController.updateUser(param, updateUserDto);

            // Then
            expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
            expect(mockUserService.updateUser).toHaveBeenCalledWith(
                param,
                updateUserDto,
            );
        });
    });

    describe('회원 탈퇴', () => {
        it('service 파라미터 전달 제대로 하는지', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: true,
                userInfo: {
                    nickname: 'testNick',
                    profileImg: 'testImg',
                    role: expect.any(Number),
                    userId: UserDummy[0].userId,
                },
            };
            const param: number = UserDummy[0].userId;

            // When
            await userController.withdraw(param, req, res);

            // Then
            expect(mockUserService.withdraw).toHaveBeenCalledTimes(1);
            expect(mockUserService.withdraw).toHaveBeenCalledWith(param);
        });

        it('admin이 아니고 param, guard의 userId가 동일한 경우', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: true,
                userInfo: {
                    nickname: 'testNick',
                    profileImg: 'testImg',
                    role: 2,
                    userId: UserDummy[0].userId,
                },
            };
            const param: number = UserDummy[0].userId;

            res.clearCookie = jest.fn();
            res.send = jest.fn();

            // When
            const result = await userController.withdraw(param, req, res);

            // Then
            expect(res.clearCookie).toHaveBeenCalledTimes(2);
            expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        it('admin이 아니고 param, guard의 userId가 다를 경우', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: true,
                userInfo: {
                    nickname: 'testNick',
                    profileImg: 'testImg',
                    role: 2,
                    userId: UserDummy[0].userId,
                },
            };
            const param: number = UserDummy[1].userId;

            // When
            try {
                const result = await userController.withdraw(param, req, res);
            } catch (error) {
                // Then
                expect(error.message).toEqual('잘못된 접근입니다.');
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });

        it('어드민일때 유저아이디가 달라도 제대로 동작 하는지', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: true,
                userInfo: {
                    nickname: 'testNick',
                    profileImg: 'testImg',
                    role: 1,
                    userId: UserDummy[0].userId,
                },
            };
            const param: number = UserDummy[1].userId;

            res.clearCookie = jest.fn();
            res.send = jest.fn();

            // When
            const result = await userController.withdraw(param, req, res);

            // Then
            expect(res.clearCookie).toHaveBeenCalledTimes(2);
            expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(res.send).toHaveBeenCalledTimes(1);
        });
    });
});
