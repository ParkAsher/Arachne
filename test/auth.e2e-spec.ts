import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserDummy } from './dummy/user.dummy';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { CheckAuthCodeDto } from 'src/auth/dto/check-auth-code.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import axios from 'axios';

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
                MailerModule.forRoot({
                    transport: {
                        host: process.env.MAILTRAP_HOST,
                        port: +process.env.MAILTRAP_PORT,
                        auth: {
                            user: process.env.MAILTRAP_USER,
                            pass: process.env.MAILTRAP_PASS,
                        },
                    },
                    defaults: {
                        from: process.env.MAILTRAP_FROM,
                        name: process.env.MAILTRAP_NAME,
                    },
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
            const body = { email: UserDummy[0].email };

            // When
            const res = await server.post(url).send(body);

            // Then
            expect(res.status).toBe(201);
        });
    });

    describe('POST /api/auth/check-auth-code', () => {
        it('비밀번호 찾기 - 인증번호 확인', async () => {
            // Given
            const url = '/api/auth/check-auth-code';
            const { data } = await axios.get(
                `https://mailtrap.io/api/accounts/${process.env.MAILTRAP_ACCOUNT_ID}/inboxes/${process.env.MAILTRAP_INBOX_ID}/messages`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Api-Token': process.env.MAILTRAP_API_TOKEN,
                    },
                },
            );
            const checkAuthCodeDto: CheckAuthCodeDto = {
                email: UserDummy[0].email,
                authCode: +data[0].subject.split(':')[1].trim(),
            };

            // When
            const res = await server.post(url).send(checkAuthCodeDto);

            // Then
            expect(res.status).toBe(201);
        });
    });
});
