import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Articles } from 'src/entities/articles.entity';
import { ArticleDummy } from '../../test/dummy/article.dummy';
import { NotFoundException } from '@nestjs/common';

describe('ArticleService', () => {
    let service: ArticleService;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        increment: jest.fn(),
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

    afterEach(() => {
        jest.resetAllMocks();
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
                relations: ['Users', 'Categories', 'Likes'],
            });
        });
    });

    describe('게시글 상세조회', () => {
        it('게시글이 존재하지 않는 경우', async () => {
            // Given
            const articleId: number = ArticleDummy[0].articleId;
            try {
                // When
                await service.getArticleById(articleId);
            } catch (error) {
                // Then
                expect(error.message).toEqual('게시글이 존재하지 않습니다.');
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });

        it('repository.findOne 호출', async () => {
            // Given
            const articleId: number = ArticleDummy[0].articleId;

            mockRepository.findOne.mockReturnValue({
                articleId: expect.any(Number),
                nickname: expect.any(String),
                title: expect.any(String),
                view: expect.any(Number),
                categoryName: expect.any(String),
                like: expect.any(Number),
                updatedAt: expect.any(Date),
            });

            // When
            await service.getArticleById(articleId);

            // Then
            expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                select: ['articleId', 'title', 'view', 'updatedAt'],
                relations: ['Users', 'Categories', 'Likes'],
                where: { articleId },
            });
        });

        it('repository.increment 호출', async () => {
            // Given
            const articleId: number = ArticleDummy[0].articleId;

            mockRepository.findOne.mockReturnValue({
                articleId: expect.any(Number),
                nickname: expect.any(String),
                title: expect.any(String),
                view: expect.any(Number),
                categoryName: expect.any(String),
                like: expect.any(Number),
                updatedAt: expect.any(Date),
            });

            // When
            await service.getArticleById(articleId);

            // Then
            expect(mockRepository.increment).toHaveBeenCalledTimes(1);
            expect(mockRepository.increment).toHaveBeenCalledWith(
                { articleId },
                'view',
                1,
            );
        });

        it('transjaction 정상 가동 ', async () => {
            // Given
            // When
            // Then
        });
    });
});
