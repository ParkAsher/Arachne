import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';

const seeds = [
    {
        user_id: 1,
        id: 'test_id1',
        password: '123',
        name: 'test_name1',
        email: 'test1@gmail.com',
        nickname: 'test_nickname1',
        phone: '010-1111-1111',
        profile_img: 'default',
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        user_id: 2,
        id: 'test_id2',
        password: '123',
        name: 'test_name2',
        email: 'test2@gmail.com',
        nickname: 'test_nickname2',
        phone: '010-2222-2222',
        profile_img: 'default',
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        user_id: 3,
        id: 'test_id3',
        password: '123',
        name: 'test_name3',
        email: 'test3@gmail.com',
        nickname: 'test_nickname3',
        phone: '010-3333-3333',
        profile_img: 'default',
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
    {
        user_id: 4,
        id: 'test_id4',
        password: '123',
        name: 'test_name4',
        email: 'test4@gmail.com',
        nickname: 'test_nickname4',
        phone: '010-4444-4444',
        profile_img: 'default',
        role: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    },
];

export class UsersSeed1682180713940 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const passwordHashedSeeds = await Promise.all(
            seeds.map(async (seed) => ({
                ...seed,
                password: await bcrypt.hash(
                    seed.password,
                    Number.parseInt(process.env.HASH_SALT_OR_ROUND, 10) ?? 10,
                ),
            })),
        );

        await queryRunner.manager.save(Users, passwordHashedSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await Promise.all(
            seeds.map((seed) =>
                queryRunner.manager.delete(Users, { user_id: seed.user_id }),
            ),
        );
    }
}
