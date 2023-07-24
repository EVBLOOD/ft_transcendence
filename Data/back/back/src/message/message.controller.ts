import { Get, Controller, Param, ParseIntPipe, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Get('user/:userName')
  async getMessageBy(
    @Param('userName', ParseIntPipe) userName: number,
  ) {
    try {
      return this.messageService.getMessageByUserId(userName);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('for/:id')
  async getMessageById(
    @Param('userName', ParseIntPipe) userName: number,
    @Req() req: any
  ) {
    try {
      return this.messageService.getMessagesByChatID(userName, req.user_name.sub);
    } catch (err) {
      console.log(err);
    }
  }
}
