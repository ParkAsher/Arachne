import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('/api/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async getArticles() {
        const articles = await this.articleService.getArticles();

        return articles.map((article) => ({
            articleId: article.articleId,
            title: article.title,
            views: article.view,
            nickname: article.Users.nickname,
            categoryName: article.Categories.name,
            likes: article.Likes.length,
        }));
    }

    @Get('/:articleId')
    async getArticleById(@Param('articleId', ParseIntPipe) articleId: number) {
        const article = await this.articleService.getArticleById(articleId);

        return {
            articleId: article.articleId,
            title: article.title,
            views: article.view,
            nickname: article.Users.nickname,
            categoryName: article.Categories.name,
            likes: article.Likes.length,
        };
    }
}
