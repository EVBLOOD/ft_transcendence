import { Token } from 'src/authenticator/entities/Token.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataConf : PostgresConnectionOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'evblood123',
    database: 'ft_transcendence',
    entities: [User, Friendship, Token], // you can integrate the Entity you're working on here
    synchronize: true,
}
export default DataConf;