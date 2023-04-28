import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserDummy } from './dummy/user.dummy';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RedisModule } from '@liaoliaots/nestjs-redis';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;
    let userRepository: Repository<Users>;

    const authGuardValue = (role: number) => ({
        canActivate(context: ExecutionContext) {
            const request = context.switchToHttp().getRequest();
            request.auth = {
                isLoggedIn: true,
                userInfo: {
                    nickname: 'testNick',
                    profileImg: 'testImg',
                    role: role,
                    userId: UserDummy[0].userId,
                },
            };
            return true;
        },
    });

    const initApp = async (role: number) => {
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
                RedisModule.forRoot({
                    config: {
                        url: process.env.REDIS_URL,
                        password: process.env.REDIS_PASSWORD,
                    },
                }),
                UserModule,
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardValue(role))
            .compile();

        app = moduleFixture.createNestApplication();
        server = request(app.getHttpServer());
        userRepository = moduleFixture.get(getRepositoryToken(Users));

        await userRepository.insert(UserDummy);

        await app.init();
    };

    beforeEach(async () => {
        await initApp(1);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/users/1 GET', () => {
        it('유저 상세정보 가져오기 ', async () => {
            // Given
            const url = `/api/users/${UserDummy[0].userId}`;

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

    describe('/api/users/1 PATCH', () => {
        it('유저 정보 수정하기 - 닉네임 ', async () => {
            // Given
            const url = `/api/users/${UserDummy[0].userId}`;
            const updateUserDto: UpdateUserDto = {
                nickname: 'updateAdminNickname',
            };

            // When
            const res = await server.patch(url).send(updateUserDto);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                message: '수정 되었습니다.',
            });
        });
    });

    describe('/api/users/1 DELETE', () => {
        beforeEach(async () => {
            await initApp(2);
        });
        it('admin이 아니고 param, guard의 userId가 다를 경우', async () => {
            // Give
            const url = `/api/users/${UserDummy[1].userId}`;

            // When
            const res = await server.delete(url);

            // Then
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('잘못된 접근입니다.');
            expect(res.body.error).toBe('Unauthorized');
        });

        it('admin이 아니고 param, guard의 userId가 같을 경우', async () => {
            // Give
            const url = `/api/users/${UserDummy[0].userId}`;

            // When
            const res = await server.delete(url);

            // Then
            expect(res.status).toBe(200);
        });
    });

    describe('/api/users/1 DELETE', () => {
        beforeEach(async () => {
            await initApp(1);
        });
        it('admin이고 param, guard의 userId가 다른 경우', async () => {
            // Give
            const url = `/api/users/${UserDummy[1].userId}`;

            // When
            const res = await server.delete(url);

            // Then
            expect(res.status).toBe(200);
        });
    });
});
