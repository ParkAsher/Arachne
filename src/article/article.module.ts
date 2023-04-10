import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from './articles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Articles])],
})
export class ArticleModule {}
