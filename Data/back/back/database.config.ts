import { Token } from 'src/authenticator/entities/Token.entity';
import { Chat } from 'src/chat/chat.entity';
import { Punishment } from 'src/chat/punishment/punishment.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';
import { Match } from 'src/match/entities/match.entity';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DataConf: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'evblood123',
    database: 'ft_transcendence',
    entities: [User, Friendship, Token, Match, Statastics, Chat, Message, Punishment], // you can integrate the Entity you're working on here
    synchronize: true,
}
export default DataConf;