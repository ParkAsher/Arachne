import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articles } from 'src/entities/articles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Articles)
        private articleRepository: Repository<Articles>,
    ) {}

    async getArticles(): Promise<Articles[]> {
        return await this.articleRepository.find({
            select: ['articleId', 'title', 'view'],
            relations: ['Users', 'Categories', 'Likes'],
        });
    }

    async getArticleById(articleId: number): Promise<Articles> {
        const article = await this.articleRepository.findOne({
            select: ['articleId', 'title', 'view', 'updatedAt'],
            relations: ['Users', 'Categories', 'Likes'],
            where: { articleId },
        });

        if (!article) {
            throw new NotFoundException('게시글이 존재하지 않습니다.');
        }

        try {
            await this.articleRepository.increment({ articleId }, 'view', 1);
            ++article.view;

            return article;
        } catch (error) {
            throw error;
        }
    }
}
