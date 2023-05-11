import { Articles } from 'src/entities/articles.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const seeds = [
    {
        article_id: 1,
        title: 'test_title1',
        content: 'test_content1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user_id: 1,
        category_id: 1,
    },
    {
        article_id: 2,
        title: 'test_title2',
        content: 'test_content2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user_id: 2,
        category_id: 2,
    },
    {
        article_id: 3,
        title: 'test_title3',
        content: 'test_content3',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user_id: 3,
        category_id: 3,
    },
    {
        article_id: 4,
        title: 'test_title4',
        content: 'test_content4',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        user_id: 4,
        category_id: 4,
    },
];

export class ArticlesSeeds1682182828846 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Articles, seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            seeds.map((seed) =>
                queryRunner.manager.delete(Articles, {
                    article_id: seed.article_id,
                }),
            ),
        );
    }
}
