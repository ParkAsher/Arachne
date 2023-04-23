import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ArticleDummy } from '../../test/dummy/article.dummy';

describe('ArticleController', () => {
    let controller: ArticleController;

    const mockService = {
        getArticles: jest.fn(),
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
        await jest.clearAllMocks();
    });

    describe('게시글 전체조회', () => {
        it('service.getArticles 호출', async () => {
            // Given
            mockService.getArticles.mockResolvedValue([
                {
                    articleId: ArticleDummy[0].articleId,
                    title: ArticleDummy[0].title,
                    view: ArticleDummy[0].view,
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
});
