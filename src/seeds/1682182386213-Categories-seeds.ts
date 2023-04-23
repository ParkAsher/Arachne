import { MigrationInterface, QueryRunner } from 'typeorm';
import { Categories } from 'src/entities/categories.entity';

const seeds = [
    {
        category_id: 1,
        name: 'test_name1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        category_id: 2,
        name: 'test_name2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        category_id: 3,
        name: 'test_name3',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        category_id: 4,
        name: 'test_name4',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
];
export class CategoriesSeeds1682182386213 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(Categories, seeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            seeds.map((seed) =>
                queryRunner.manager.delete(Categories, {
                    category_id: seed.category_id,
                }),
            ),
        );
    }
}
