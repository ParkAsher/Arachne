import { Comments } from 'src/entities/comments.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const seeds = [
    {
        comment_id: 1,
        comment: 'test_comment1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        comment_id: 2,
        comment: 'test_comment2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        comment_id: 3,
        comment: 'test_comment3',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        comment_id: 4,
        comment: 'test_comment4',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
];

export class CommentsSeeds1682183806811 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Comments, seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            seeds.map((seed) =>
                queryRunner.manager.delete(Comments, {
                    comment_id: seed.comment_id,
                }),
            ),
        );
    }
}
