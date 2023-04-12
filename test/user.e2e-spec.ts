import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Users } from 'src/entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserDummy } from './dummy/user.dummy';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let userService: UserService;
    let server: request.SuperTest<request.Test>;
    let userRepository: Repository<Users>;

    beforeEach(async () => {
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
        }).compile();

        app = moduleFixture.createNestApplication();
        userService = moduleFixture.get<UserService>(UserService);
        server = request(app.getHttpServer());
        userRepository = moduleFixture.get(getRepositoryToken(Users));

        await userRepository.insert(UserDummy);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/user/1 GET', () => {
        it('유저 상세정보 가져오기 ', async () => {
            // Given
            const url = `/api/user/${UserDummy[0].userId}`;

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
});
