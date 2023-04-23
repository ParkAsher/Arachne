import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Articles } from 'src/entities/articles.entity';

describe('ArticleService', () => {
    let service: ArticleService;

    const mockRepository = {
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticleService,
                {
                    provide: getRepositoryToken(Articles),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ArticleService>(ArticleService);
    });

    describe('게시글 전체조회', () => {
        it('repository.find 호출', async () => {
            // When
            await service.getArticles();

            // Then
            expect(mockRepository.find).toHaveBeenCalledTimes(1);
        });

        it('repository.find 파라미터 전달', async () => {
            // When
            await service.getArticles();

            // Then
            expect(mockRepository.find).toHaveBeenCalledWith({
                select: ['articleId', 'title', 'view'],
                relations: ['Users', 'Categories'],
            });
        });
    });
});
