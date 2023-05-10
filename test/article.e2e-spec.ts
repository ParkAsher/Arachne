import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import request from 'supertest';
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
import { Likes } from 'src/entities/likes.entity';
import { LikeDummy } from './dummy/like.dummy';

describe('ArticleController (e2e)', () => {
    let app: INestApplication;
    let server: request.SuperTest<request.Test>;
    let userRepository: Repository<Users>;
    let articleRepository: Repository<Articles>;
    let categoryRepository: Repository<Categories>;
    let likeRepository: Repository<Likes>;

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
                ArticleModule,
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardValue())
            .compile();

        app = moduleFixture.createNestApplication();
        server = request(app.getHttpServer());
        userRepository = moduleFixture.get(getRepositoryToken(Users));
        articleRepository = moduleFixture.get(getRepositoryToken(Articles));
        categoryRepository = moduleFixture.get(getRepositoryToken(Categories));
        likeRepository = moduleFixture.get(getRepositoryToken(Likes));

        await userRepository.insert(UserDummy);
        await articleRepository.insert(ArticleDummy);
        await categoryRepository.insert(CategoryDummy);
        await likeRepository.insert(LikeDummy);

        await app.init();
    };

    beforeEach(async () => {
        await initApp();
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
                    views: article.view,
                    likes: expect.any(Number),
                    nickname: expect.any(String),
                    categoryName: expect.any(String),
                })),
            );
        });
    });

    describe('/api/articles/:articleId GET', () => {
        it('return value 구조', async () => {
            // Given
            const INDEX: number = 1;
            const articleId: number = ArticleDummy[INDEX].articleId;
            const url: string = `/api/articles/${articleId}`;
            let likeCount: number = 0;

            LikeDummy.forEach((like) => {
                if (like.articleId === articleId) {
                    likeCount += 1;
                }
            });

            const [{ nickname }] = UserDummy.filter(
                (user) => user.userId === ArticleDummy[INDEX].user_id,
            );

            const [{ name: categoryName }] = CategoryDummy.filter(
                (category) =>
                    category.category_id === ArticleDummy[INDEX].category_id,
            );

            // When
            const res = await server.get(url);

            // Then
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                articleId: ArticleDummy[INDEX].articleId,
                title: ArticleDummy[INDEX].title,
                views: res.body.views,
                likes: likeCount,
                nickname,
                categoryName,
            });
        });
    });
});
