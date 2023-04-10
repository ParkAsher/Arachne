import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from '../entities/articles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Articles])],
})
export class ArticleModule {}
