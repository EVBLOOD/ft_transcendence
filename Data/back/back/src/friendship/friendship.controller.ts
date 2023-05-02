import { Controller, Post, Body, Param, UsePipes, Get, UseGuards, Request } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';
import { UservalidatingPipe } from './uservalidating/uservalidating.pipe';
import { Matches } from 'class-validator';
import { IsauthGuard } from 'src/auth/isauth.guard';

@UseGuards(IsauthGuard)
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}


  @Get(':id')
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  async findOne(@Request() req, @Param('id') id: string) {
    console.log(req.user);
    return await this.friendshipService.findOne(id);
  }

  @Post('suggestions')
  @UsePipes(new UservalidatingPipe())
  async suggestions(@Body() id: UserValidatingDto)
  {
    return await this.friendshipService.suggested(id);
  }

  @Post('friendList')
  @UsePipes(new UservalidatingPipe())
  async friendList(@Body() id: UserValidatingDto)
  {
    return await this.friendshipService.friendList(id);
  }

  @Post('unblock')
  @UsePipes(new UservalidatingPipe())
  async unblock(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.unblock(body);
  }

  @Post('unfriend')
  @UsePipes(new UservalidatingPipe())
  async unfriend(@Body() body: DealingWithRequestDto)
  {
    return await this.friendshipService.remove(body);
  }

  @Post('blocking')
  @UsePipes(new UservalidatingPipe())
  async blocking(@Body() body: DealingWithRequestDto)
  {
    return await this.friendshipService.blocking(body);
  }

  @Post('blocklist')
  @UsePipes(new UservalidatingPipe())
  async blocklist(@Body() id : UserValidatingDto)
  {
    console.log(id.Userone);
    return await this.friendshipService.blocklist(id);
  }

  @Post('requestsList')
  @UsePipes(new UservalidatingPipe())
  async requestsList(@Body() id: UserValidatingDto)
  {
    return await this.friendshipService.requestsList(id);
  }

  @Post('accept')
  @UsePipes(new UservalidatingPipe())
  async accepting(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.accepting(body)
  }

  @Post('send')
  @UsePipes(new UservalidatingPipe())
  async send(@Body() body : DealingWithRequestDto)
  {
    return await this.friendshipService.create(body);
  }
}
