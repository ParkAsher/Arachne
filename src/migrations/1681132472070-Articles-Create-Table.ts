import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ArticlesCreateTablets1681132472070 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Articles',
                columns: [
                    {
                        name: 'article_id',
                        type: 'int',
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'view',
                        type: 'int',
                        isNullable: true,
                        default: 0,
                    },
                    {
                        name: 'category_id',
                        type: 'tinyint',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: true,
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        isNullable: true,
                        default: 'now()',
                        onUpdate: 'now()',
                    },
                    {
                        name: 'deleted_at',
                        type: 'datetime',
                        isNullable: true,
                        default: null,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Articles');
    }
}
