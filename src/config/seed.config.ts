import { DataSource } from 'typeorm';
import { ormConfig } from './orm.config';

const seedDataSource = new DataSource({
    ...ormConfig,
    migrationsTableName: 'seeds',
    migrations: ['./src/seeds/*'],
});

export default seedDataSource;
