import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UsersCreateTable1681126131251 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'Users',
                columns: [
                    {
                        name: 'user_id',
                        type: 'int',
                        unsigned: true,
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'id',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'nickname',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'phone',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'profile_img',
                        type: 'varchar',
                        isNullable: true,
                        default:
                            '"https://previews.123rf.com/images/virtosmedia/virtosmedia2303/virtosmedia230322242/200025658-%EC%9D%B4%EC%8A%AC%EC%9D%B4-%EB%A7%BA%ED%9E%8C-%EA%B1%B0%EB%AF%B8%EC%A4%84-3d-%EA%B7%B8%EB%A6%BC%EC%9E%85%EB%8B%88%EB%8B%A4.jpg"',
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
        await queryRunner.dropTable('Users');
    }
}
