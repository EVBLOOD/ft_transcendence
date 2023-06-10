import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/user.entity';
import { Message } from 'src/message/message.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataConf : PostgresConnectionOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'evblood123',
    database: 'ft_transcendence',
    entities: [User, Message, Chat], // you can integrate the Entity you're working on here
    synchronize: true,
}
export default DataConf;

