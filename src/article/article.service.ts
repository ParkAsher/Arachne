import { Injectable } from '@nestjs/common';
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
            relations: ['Users', 'Categories'],
        });
    }
}
