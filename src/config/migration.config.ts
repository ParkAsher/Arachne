import { DataSource } from 'typeorm';
import { ormConfig } from './orm.config';

const migrationDataSource = new DataSource({
    ...ormConfig,
    migrationsTableName: 'migrations',
    migrations: ['./src/migrations/*'],
});

export default migrationDataSource;
