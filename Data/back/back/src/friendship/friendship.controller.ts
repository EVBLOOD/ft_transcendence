import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get('suggestions/:id')
  async suggestions(@Param("id") id: UserValidatingDto)
  {
    return await this.friendshipService.suggested(id);
  }

  @Get('friendList/:id')
  async friendList(@Param("id") id: UserValidatingDto)
  {
    return await this.friendshipService.friendList(id);
  }

  @Post('unblock')
  async unblock(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.unblock(body);
  }

  @Post('unfriend')
  async unfriend(@Body() body: DealingWithRequestDto)
  {
    return await this.friendshipService.remove(body);
  }

  @Post('blocking')
  async blocking(@Body() body: DealingWithRequestDto)
  {
    return await this.friendshipService.blocking(body);
  }

  @Get('blocklist/:id')
  async blocklist(@Param(':id') id : UserValidatingDto)
  {
    return await this.blocklist(id);
  }

  @Get('requestsList/:id')
  async requestsList(@Param(':id') id: UserValidatingDto)
  {
    return await this.friendshipService.requestsList(id);
  }

  @Post('accept')
  async accepting(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.accepting(body)
  }

  @Post('send')
  async send(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.create(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.friendshipService.findOne(id);
  }

}
