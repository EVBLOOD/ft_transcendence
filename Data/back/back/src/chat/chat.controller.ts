import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { GetUser } from './../message/message.controller';
import { User } from 'src/user/user.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly charRoomSevice: ChatService) {}

  @Get(":id")
  async getChatRoomByID( @Param("id", ParseIntPipe) id: number): Promise<Chat | undefined>
  {
  	try {
  		return this.charRoomSevice.GetChatRoomByID(id);
  	}
    catch(err) {
      console.log(err);
    }
  }


  @Get("/user/:userID")
  async getChatRoomsOfUser(
    @Param("userID", ParseIntPipe) userID: number,
    @GetUser() user: User
  ) : Promise<Chat[]>{

  }

} // end of ChatController class
