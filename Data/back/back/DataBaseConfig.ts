
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataBaseConfig : PostgresConnectionOptions = {
    type: 'postgres',
    host: 'dataBase',
    port: 5432,
    username: 'postgres',
    password: 'evblood123',
    database: 'ft_transcendence',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,//will be changed to no after the project end
}

export default DataBaseConfig;