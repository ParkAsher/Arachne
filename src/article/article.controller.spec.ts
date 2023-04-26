import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleDummy } from '../../test/dummy/article.dummy';

describe('ArticleController', () => {
    let controller: ArticleController;

    const mockService = {
        getArticles: jest.fn(),
        getArticleById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticleController],
            providers: [ArticleService],
        })
            .overrideProvider(ArticleService)
            .useValue(mockService)
            .overrideGuard(AuthGuard)
            .useValue({
                canActive() {
                    return true;
                },
            })
            .compile();

        controller = module.get<ArticleController>(ArticleController);
    });

    afterEach(async () => {
        await jest.resetAllMocks();
    });

    describe('게시글 전체조회', () => {
        it('service.getArticles 호출', async () => {
            // Given
            mockService.getArticles.mockResolvedValue([
                {
                    articleId: ArticleDummy[0].articleId,
                    title: ArticleDummy[0].title,
                    views: ArticleDummy[0].view,
                    Likes: {
                        likes: expect.any(Number),
                    },
                    Users: {
                        nickname: expect.any(String),
                    },
                    Categories: {
                        categoryName: expect.any(String),
                    },
                },
            ]);

            // When
            await controller.getArticles();

            // Then
            expect(mockService.getArticles).toHaveBeenCalledTimes(1);
        });
    });

    describe('게시글 상세조회', () => {
        it('service.getArticleById 호출', async () => {
            // Given
            const param: number = ArticleDummy[0].articleId;

            mockService.getArticleById.mockResolvedValue({
                articleId: expect.any(Number),
                title: expect.any(String),
                views: expect.any(Number),
                Users: {
                    nickname: expect.any(String),
                },
                Categories: {
                    categoryName: expect.any(String),
                },
                Likes: {
                    likes: expect.any(Number),
                },
            });

            // When
            await controller.getArticleById(param);

            // Then
            expect(mockService.getArticleById).toHaveBeenCalledTimes(1);
        });

        it('parameter 전달 제대로 하는지', async () => {
            // Given
            const param: number = ArticleDummy[0].articleId;

            mockService.getArticleById.mockResolvedValue({
                articleId: expect.any(Number),
                title: expect.any(String),
                views: expect.any(Number),
                Users: {
                    nickname: expect.any(String),
                },
                Categories: {
                    categoryName: expect.any(String),
                },
                Likes: {
                    likes: expect.any(Number),
                },
            });

            // When
            await controller.getArticleById(param);

            // Then
            expect(mockService.getArticleById).toHaveBeenCalledWith(param);
        });
    });
});
