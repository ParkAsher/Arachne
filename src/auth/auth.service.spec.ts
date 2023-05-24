import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { MailService } from 'src/mail/mail.service';
import { UserDummy } from '../../test/dummy/user.dummy';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;

    const mockUserRepository = {};
    const mockCacheService = {
        setAuthCode: jest.fn(),
        getValueByKeyInRedis: jest.fn(),
        removeAuthCode: jest.fn(),
    };
    const mockMailService = { sendAuthCode: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(Users),
                    useValue: mockUserRepository,
                },
                JwtService,
                CacheService,
                MailService,
            ],
        })
            .overrideProvider(CacheService)
            .useValue(mockCacheService)
            .overrideProvider(MailService)
            .useValue(mockMailService)
            .compile();

        authService = module.get<AuthService>(AuthService);
    });

    afterEach(async () => {
        await jest.clearAllMocks();
    });
    describe('비밀번호 찾기 - 인증메일 보내기', () => {
        it('auth.service.sendAuthCode 제대로 작동 하는지', async () => {
            // Given
            const email = UserDummy[0].email;
            const authCode = 123123;
            mockMailService.sendAuthCode.mockReturnValue(authCode);

            // When
            await authService.sendAuthCode(email);

            // Then
            expect(mockMailService.sendAuthCode).toHaveBeenCalledTimes(1);
            expect(mockCacheService.setAuthCode).toHaveBeenCalledTimes(1);

            expect(mockMailService.sendAuthCode).toHaveBeenCalledWith(email);
            expect(mockCacheService.setAuthCode).toHaveBeenCalledWith(
                email,
                authCode,
            );
        });
    });

    describe('비밀번호 찾기 - 인증번호 확인', () => {
        it('cacheService.removeAuthCode - 성공', async () => {
            // Given
            const checkAuthCodeDto: CheckAuthCodeDto = {
                email: UserDummy[0].email,
                authCode: 123213,
            };

            mockCacheService.getValueByKeyInRedis.mockResolvedValue(
                checkAuthCodeDto.authCode,
            );

            // When
            await authService.checkAuthCode(checkAuthCodeDto);

            // Then
            expect(mockCacheService.getValueByKeyInRedis).toHaveBeenCalledTimes(
                1,
            );
            expect(mockCacheService.getValueByKeyInRedis).toHaveBeenCalledWith(
                checkAuthCodeDto.email,
            );

            expect(mockCacheService.removeAuthCode).toHaveBeenCalledTimes(1);
            expect(mockCacheService.removeAuthCode).toHaveBeenCalledWith(
                checkAuthCodeDto,
            );
        });

        it('cacheService.removeAuthCode - 실패(레디스에 정보가 없을 때 | 입력시간이 3분이 지났을 때) ', async () => {
            // Given
            const checkAuthCodeDto: CheckAuthCodeDto = {
                email: UserDummy[0].email,
                authCode: 123213,
            };

            mockCacheService.getValueByKeyInRedis.mockResolvedValue(undefined);

            // When
            try {
                await authService.checkAuthCode(checkAuthCodeDto);
            } catch (err) {
                // Then
                expect(err.message).toEqual('3분이 지났습니다!');
                expect(err).toBeInstanceOf(UnauthorizedException);
            }
        });

        it('cacheService.removeAuthCode - 실패(이메일은 맞지만 인증번호가 틀렸을 때) ', async () => {
            // Given
            const checkAuthCodeDto: CheckAuthCodeDto = {
                email: UserDummy[0].email,
                authCode: 111111,
            };

            mockCacheService.getValueByKeyInRedis.mockResolvedValue(123123);

            // When
            try {
                await authService.checkAuthCode(checkAuthCodeDto);
            } catch (err) {
                // Then
                expect(err.message).toEqual('인증코드가 틀립니다!');
                expect(err).toBeInstanceOf(UnauthorizedException);
            }
        });
    });
});
