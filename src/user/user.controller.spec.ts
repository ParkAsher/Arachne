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
import { PasswordResetRequestDto } from './dto/password-reset-request.dto';

describe('UserController', () => {
    let userController: UserController;

    const mockUserService = {
        findUserByUserId: jest.fn(),
        signUpUser: jest.fn(),
        updateUserProfile: jest.fn(),
        withdraw: jest.fn(),
        checkUserForFindPassword: jest.fn(),
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
        it('user.service.findUserByUserId 호출 제대로 하는지', () => {
            // Given
            const req = mocks.createRequest();
            req.auth = {
                isLoggedIn: true,
                userId: UserDummy[0].userId,
            };

            // When
            userController.getUser(req);

            // Then
            expect(mockUserService.findUserByUserId).toHaveBeenCalledTimes(1);
            expect(mockUserService.findUserByUserId).toHaveBeenCalledWith(
                req.auth.userId,
            );
        });
    });

    describe('회원가입', () => {
        it('user.service.signUpUser 호출 제대로 하는지', async () => {
            // Givne
            const body: signupUserDto = {
                id: 'test-id',
                password: '123123',
                email: 'test@test.com',
                phone: '01012341234',
                nickname: 'test-nick',
                name: 'test-name',
            };

            // When
            await userController.signUp(body);

            // Then
            expect(mockUserService.signUpUser).toHaveBeenCalledTimes(1);

            expect(mockUserService.signUpUser).toHaveBeenCalledWith(body);
        });
    });

    describe('유저 정보 업데이트', () => {
        it('user.service.updateUserProfile 호출 제대로 하는지', () => {
            // Given
            const body: UpdateUserDto = {
                nickname: 'updateNickname',
                email: 'updateEmail@email.com',
            };
            const req = mocks.createRequest();
            req.auth = {
                isLoggedIn: true,
                userId: UserDummy[0].userId,
            };

            // When
            userController.updateUser(body, req);

            // Then
            expect(mockUserService.updateUserProfile).toHaveBeenCalledTimes(1);
            expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(
                req.auth.userId,
                body,
            );
        });
    });

    describe('회원 탈퇴', () => {
        it('user.service.withdraw 호출 제대로 하는지', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: true,
                userId: UserDummy[0].userId,
            };
            res.clearCookie = jest.fn();
            res.send = jest.fn();

            // When
            await userController.withdraw(req, res);

            // Then
            expect(mockUserService.withdraw).toHaveBeenCalledTimes(1);
            expect(mockUserService.withdraw).toHaveBeenCalledWith(
                req.auth.userId,
            );
            expect(res.clearCookie).toHaveBeenCalledTimes(2);
            expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(res.send).toHaveBeenCalledTimes(1);
        });

        it('로그인이 되어 있지 않을 때', async () => {
            // Given
            const req = mocks.createRequest();
            const res = mocks.createResponse();
            req.auth = {
                isLoggedIn: false,
                userId: null,
            };

            // When
            try {
                await userController.withdraw(req, res);
            } catch (error) {
                // Then
                expect(error.message).toEqual('로그인 중이 아닙니다.');
                expect(error).toBeInstanceOf(UnauthorizedException);
            }
        });
    });

    describe('비밀번호 찾기', () => {
        it('user.service.checkUserForFindPassword 호출 제대로 하는지', async () => {
            // Given
            const resetPasswordRequestDto: PasswordResetRequestDto = {
                email: UserDummy[0].email,
                id: UserDummy[0].id,
                nickname: UserDummy[0].nickname,
            };

            // When
            await userController.checkUserForFindPassword(
                resetPasswordRequestDto,
            );

            // Then
            expect(
                mockUserService.checkUserForFindPassword,
            ).toHaveBeenCalledTimes(1);
            expect(
                mockUserService.checkUserForFindPassword,
            ).toHaveBeenCalledWith(resetPasswordRequestDto);
        });
    });
});
