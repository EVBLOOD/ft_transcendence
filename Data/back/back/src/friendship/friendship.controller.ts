import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto, DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // @Post('sendRequest')
  // async ccreate(@Body() createFriendshipDto: CreateFriendshipDto) {
  //   return await this.friendshipService.create(createFriendshipDto);
  // }
  @Get('suggestions/:id')
  async suggestions(@Param(":id") id: UserValidatingDto)
  {
    return await this.friendshipService.suggested(id);
  }

  @Get('friendList/:id')
  async friendList(@Param(":id") id: UserValidatingDto)
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendshipDto: UpdateFriendshipDto) {
  //   return this.friendshipService.update(+id, updateFriendshipDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendshipService.remove(+id);
  // }
}
