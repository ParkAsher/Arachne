import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from '../entities/articles.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Users } from 'src/entities/users.entity';
import { Comments } from 'src/entities/comments.entity';
import { Categories } from 'src/entities/categories.entity';
import { Likes } from 'src/entities/likes.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Articles,
            Users,
            Comments,
            Categories,
            Likes,
        ]),
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
