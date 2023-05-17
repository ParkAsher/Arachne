import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserDummy } from './dummy/user.dummy';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;

    const authGuardValue = () => ({
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest();
            request.auth = {
                isLoggedIn: true,
                userId: UserDummy[0].userId,
            };
            return true;
        },
    });

    const initApp = async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                TypeOrmModule.forRoot({
                    type: 'better-sqlite3',
                    database: ':memory:',
                    autoLoadEntities: true,
                    synchronize: true,
                    logging: false,
                }),
                AuthModule,
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardValue())
            .compile();

        app = moduleFixture.createNestApplication();
        server = request(app.getHttpServer());

        await app.init();
    };

    beforeEach(async () => {
        await initApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /api/auth/send-auth-code', () => {
        it('비밀번호 찾기 - 인증메일 보내기', async () => {
            // Given
            const url = '/api/auth/send-auth-code';
            const body = { email: 'freersong@gmail.com' };

            // When
            const res = await server.post(url).send(body);

            // Then
            expect(1 + 1).toBe(2);
            expect(res.status).toBe(201);
        });
    });
});
