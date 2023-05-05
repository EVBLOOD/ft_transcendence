import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Members } from './entities/membership.entity';
import { Messages } from './entities/Messages.entity';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private readonly ChatRepo : Repository<Chat>,
    @InjectRepository(Members) private readonly MembersRepo : Repository<Members>,
    @InjectRepository(Messages) private readonly MessagesRepo : Repository<Messages>) {}


  async SendMessage() // userid // chatid // messagebody // messagetime
  {

  }

  async LoadMessages() // chatid // userid
  {

  }

  async CreateChannel() // userid // chat info
  {

  }

  async RemoveChannel() // userid // chatid
  {

  }

  async UpdateChannelName() // userid // chatid // chat info update {same as create channel}
  {

  }

  async GetIntoChannel() // userid - chatid          {-> same as add members the only diff is in the parameters passed by controlers
  {

  }

  async GetOutChannel() // userid - chatid
  {

  }

  async GetMembers() // userid - chatid
  {

  }

  async MarkasAdmin() // userid1 - userid2 - chatid
  {

  }

  async exemptAdmin() // userid1 - userid2 - chatid
  {

  }

  async BlockMember() // userid1 - userid2 - chatid
  {

  }

  async MuteMember() // userid1 - userid2 - chatid
  {

  }

  async findProtectedgroup() // userid - chatid
  {

  }
}
