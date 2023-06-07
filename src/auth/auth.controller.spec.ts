import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDummy } from '../../test/dummy/user.dummy';
import { SendAuthCodeDto } from './dto/send-auth-code.dto';

describe('AuthController', () => {
    let authController: AuthController;

    const mockAuthService = {
        sendAuthCode: jest.fn(),
        checkAuthCode: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
            .overrideProvider(AuthService)
            .useValue(mockAuthService)
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    describe('비밀번호 찾기 - 인증메일 보내기', () => {
        it('auth.service.sendAuthCode 호출 제대로 하는지', async () => {
            // Given
            const body: SendAuthCodeDto = { email: UserDummy[0].email };

            // When
            authController.sendAuthCode(body);

            // Then
            expect(mockAuthService.sendAuthCode).toHaveBeenCalledTimes(1);
            expect(mockAuthService.sendAuthCode).toHaveBeenCalledWith(
                body.email,
            );
        });
    });

    describe('비밀번호 찾기 - 인증번호 확인', () => {
        it('auth.service.checkAuthCode 호출 제대로 하는지', async () => {
            // Given
            const body = { email: UserDummy[0].email, authCode: 123123 };

            // When
            authController.checkAuthCode(body);

            // Then
            expect(mockAuthService.checkAuthCode).toHaveBeenCalledTimes(1);
            expect(mockAuthService.checkAuthCode).toHaveBeenCalledWith(body);
        });
    });
});
