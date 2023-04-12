/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as mocks from 'node-mocks-http';
import { signupUserDto } from './dto/signup-user.dto';

describe('UserController', () => {
    let userController: UserController;

    const mockUserService = {
        getUser: jest.fn(),
        signUpUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .compile();

        userController = module.get<UserController>(UserController);
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    describe('유저 상세정보 가져오기', () => {
        it('param -> service 전달 제대로 하는지', async () => {
            // Given
            const param: number = 1;

            // When
            await userController.getUser(param);

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
});
