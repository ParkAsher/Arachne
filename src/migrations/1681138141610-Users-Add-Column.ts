import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UsersAddColumn1681138141610 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'Users',
            new TableColumn({
                name: 'role',
                type: 'int',
                unsigned: true,
                isNullable: true,
                default: 2,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('Users', 'role');
    }
}
