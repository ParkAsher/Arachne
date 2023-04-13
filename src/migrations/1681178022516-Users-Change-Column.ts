import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UsersChangeColumn1681178022516 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        /**
         * 회원가입 대기를 표현하기 위해
         * 1. 회원가입 대기 테이블을 만들어 관리.
         * 2. 유저테이블의 role컬럼으로 관리 - 채택
         *
         * 2번을 선택한 이유
         * 1번 방법을 이용하면 회원가입을 할 때 대기 테이블에 데이터를 인서트하고,
         * 관리자가 수락시 대기테이블에서 삭제, 유저테이블에 인서트.
         * 2번 방법을 이용하면 회원가입을 할 때 유저테이블의 role컬럼을 가입대기로 인서트
         * 관리자가 수락시 유저테이블 수정
         *
         * 쿼리 실행이 1번 적다.
         */
        await queryRunner.changeColumn(
            'Users',
            'role',
            new TableColumn({
                name: 'role',
                type: 'int',
                unsigned: true,
                isNullable: true,
                default: 3,
                comment: '"관리자: 1, 일반유저: 2, 가입대기: 3"',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            'Users',
            'role',
            new TableColumn({
                name: 'role',
                type: 'int',
                unsigned: true,
                isNullable: true,
                default: 2,
                comment: '"관리자: 1, 일반유저: 2"',
            }),
        );
    }
}
