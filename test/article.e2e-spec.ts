import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleModule } from 'src/article/article.module';

import { Users } from 'src/entities/users.entity';
import { Articles } from 'src/entities/articles.entity';
import { Categories } from 'src/entities/categories.entity';

import { UserDummy } from './dummy/user.dummy';
import { ArticleDummy } from './dummy/article.dummy';
import { CategoryDummy } from './dummy/category.dummy';

describe('ArticleController (e2e)', () => {
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;
    let userRepository: Repository<Users>;
    let articleRepository: Repository<Articles>;
    let categoryRepository: Repository<Categories>;

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
                ArticleModule,
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardValue(role))
            .compile();

        app = moduleFixture.createNestApplication();
        server = request(app.getHttpServer());
        userRepository = moduleFixture.get(getRepositoryToken(Users));
        articleRepository = moduleFixture.get(getRepositoryToken(Articles));
        categoryRepository = moduleFixture.get(getRepositoryToken(Categories));

        await userRepository.insert(UserDummy);
        await articleRepository.insert(ArticleDummy);
        await categoryRepository.insert(CategoryDummy);

        await app.init();
    };

    beforeEach(async () => {
        await initApp(1);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/api/articles GET', () => {
        it('return value 구조', async () => {
            // Given
            const url = '/api/articles';

            // When
            const res = await server.get(url);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                ArticleDummy.map((article) => ({
                    articleId: article.articleId,
                    title: article.title,
                    view: article.view,
                    nickname: expect.any(String),
                    categoryName: expect.any(String),
                })),
            );
        });
    });
});
