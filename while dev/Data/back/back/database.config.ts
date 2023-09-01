import { Token } from 'src/authenticator/entities/Token.entity';
import { Messages } from 'src/chat/entities/Messages.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Members } from 'src/chat/entities/membership.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';
import { Match } from 'src/match/entities/match.entity';
import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataConf: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Friendship, Token, Match, Statastics, Chat, Messages, Members], // you can integrate the Entity you're working on here
    synchronize: true,
}
export default DataConf;