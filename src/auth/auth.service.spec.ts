import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/cache/cache.service';
import { MailService } from 'src/mail/mail.service';
import { UserDummy } from '../../test/dummy/user.dummy';

describe('AuthService', () => {
    let authService: AuthService;

    const mockUserRepository = {};
    const mockCacheService = { setAuthCode: jest.fn() };
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

    describe('비밀번호 찾기 - 인증메일 보내기', () => {
        it('auth.service.sendAuthCode 제대로 작동 하는지', async () => {
            // Given
            const email = UserDummy[0].email;
            const authCode = '123123';
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
});
