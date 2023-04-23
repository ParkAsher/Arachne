import { Controller, Get } from '@nestjs/common';
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
            view: article.view,
            nickname: article.Users.nickname,
            categoryName: article.Categories.name,
        }));
    }
}
