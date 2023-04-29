import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataConf : PostgresConnectionOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'evblood123',
    database: 'ft_transcendence',
    entities: [],
    synchronize: true,
}
export default DataConf;