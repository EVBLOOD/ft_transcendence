import { Get, Controller, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('user/:userName')
  async getMessageById(
    @Param('userName') userName: string,
  ): Promise<Message[] | undefined> {
    try {
      return this.messageService.getMessageByUserId(userName);
    } catch (err) {
      console.log(err);
    }
  }
}
