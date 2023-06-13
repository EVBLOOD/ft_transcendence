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

/*
 ** return the current user object within a request
 */
export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (data) {
      return request.user?.[data];
    }
    return request.user;
  },
);

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('user/:id')
  async getMessageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Message[] | undefined> {
    try {
      return this.messageService.getMessageByUserId(id);
    } catch (err) {
      console.log(err);
    }
  }
}
