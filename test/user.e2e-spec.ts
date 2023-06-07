import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserDummy } from './dummy/user.dummy';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PasswordResetRequestDto } from 'src/user/dto/password-reset-request.dto';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;
    let userRepository: Repository<Users>;

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
                UserModule,
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardValue())
            .compile();

        app = moduleFixture.createNestApplication();
        server = request(app.getHttpServer());
        userRepository = moduleFixture.get(getRepositoryToken(Users));

        await userRepository.insert(UserDummy);
        await app.init();
    };

    beforeEach(async () => {
        await initApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/users', () => {
        it('유저 상세정보 가져오기 ', async () => {
            // Given
            const url = `/api/users`;

            // When
            const res = await server.get(url);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: UserDummy[0].id,
                name: UserDummy[0].name,
                email: UserDummy[0].email,
                nickname: UserDummy[0].nickname,
                phone: UserDummy[0].phone,
                profileImg: UserDummy[0].profileImg,
                role: UserDummy[0].role,
            });
        });
    });

    describe('PATCH /api/users', () => {
        it('유저 정보 수정하기', async () => {
            // Given
            const url = `/api/users`;
            const updateUserDto: UpdateUserDto = {
                nickname: 'updateAdminNickname',
                email: 'update-email@gmail.com',
            };

            // When
            const res = await server.patch(url).send(updateUserDto);

            // Then
            expect(res.status).toBe(200);
        });
    });

    describe('DELETE /api/users/withdraw', () => {
        it('유저 회원탈퇴', async () => {
            // Give
            const url = '/api/users/withdraw';

            // When
            const res = await server.delete(url);

            // Then
            expect(res.status).toBe(200);
        });
    });

    describe('POST /api/users/password-reset-request', () => {
        it('비밀번호 찾기 - 성공', async () => {
            // Give
            const url = '/api/users/password-reset-request';
            const PasswordResetRequestDto: PasswordResetRequestDto = {
                email: UserDummy[0].email,
                id: UserDummy[0].id,
                name: UserDummy[0].name,
            };

            // When
            const res = await server.post(url).send(PasswordResetRequestDto);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: '유저 정보가 확인되었습니다.',
            });
        });

        it('비밀번호 찾기 - 실패(입력정보 미일치)', async () => {
            // Give
            const url = '/api/users/password-reset-request';
            const PasswordResetRequestDto: PasswordResetRequestDto = {
                email: UserDummy[0].email,
                id: UserDummy[1].id,
                name: UserDummy[0].name,
            };

            // When
            const res = await server.post(url).send(PasswordResetRequestDto);

            // Then
            expect(res.status).toBe(404);
            expect(res.body.message).toEqual('유저 정보가 존재하지 않습니다.');
            expect(res.body.error).toBe('Not Found');
        });
    });
});
