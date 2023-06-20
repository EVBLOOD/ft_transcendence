import {
  Get,
  Controller,
  Param,
  ParseIntPipe,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { User } from 'src/user/user.entity';
import { Message } from './message.entity';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('user/:userName')
  async getMessageById(
    @Param('userName') userName: string,
    // @GetUser() user: User,
  ): Promise<Message[] | undefined> {
    try {
      return this.messageService.getMessageByUserId(userName);
    } catch (err) {
      console.log(err);
    }
  }
}
