import { Controller, Post, Body, Param, UsePipes, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { DealingWithRequestDto, UserValidatingDto } from './dto/create-friendship.dto';
import { UservalidatingPipe } from './uservalidating/uservalidating.pipe';
import { Matches } from 'class-validator';
import { IsauthGuard } from 'src/auth/isauth.guard';

@UseGuards(IsauthGuard)
@Controller('friendship')
export class FriendshipController {
  private readonly logger = new Logger(FriendshipController.name);
  constructor(private readonly friendshipService: FriendshipService) {}


  @Get()
  itsMe(@Request() req : any)
  {
    console.log(req.user);
    return req.user;
  }

  @Get(':id')
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  async findOne(@Param('id') id: string) {
    return await this.friendshipService.findOne(id); // TODO: I may check next the User if is blockig you..
  }

  @Get('suggestions')
  async suggestions(@Request() req : any)
  {
    const x = req.user;
    console.log(x);
   this.logger.debug("---------------------------------------------------------------------");
   this.logger.debug(`this user is looking for suggestions ${x.username}`);
   this.logger.debug("---------------------------------------------------------------------");
    return await this.friendshipService.suggested(x.username);
  }

  // @Post('suggestions')
  // @UsePipes(new UservalidatingPipe())
  // async suggestions(@Body() id: UserValidatingDto)
  // {
  //   return await this.friendshipService.suggested(id);
  // }

  @Get('friendList')
  async friendList(@Request() req : any)
  {
    return await this.friendshipService.friendList(req.user.username);
  }

  // @Post('friendList')
  // @UsePipes(new UservalidatingPipe())
  // async friendList(@Body() id: UserValidatingDto)
  // {
  //   return await this.friendshipService.friendList(id);
  // }


  // @Post('unblock')
  // @UsePipes(new UservalidatingPipe())
  // async unblock(@Body() body : DealingWithRequestDto)
  // {
  //   return await this.friendshipService.unblock(body);
  // }

  @Get('unblock')
  @UsePipes(new UservalidatingPipe())
  async unblock(@Request() req : any, @Body() body : UserValidatingDto)
  {
    return await this.friendshipService.unblock({Userone: req.user.username, Usertwo: body.Userone});
  }

  // (@Request() req : any, @Body() body : UserValidatingDto)
  // {Userone: req.user.username, Usertwo: body.Userone}
  // @Post('unfriend')
  // @UsePipes(new UservalidatingPipe())
  // async unfriend(@Body() body: DealingWithRequestDto)
  // {
  //   return await this.friendshipService.remove(body);
  // }

  @Post('unfriend')
  @UsePipes(new UservalidatingPipe())
  async unfriend(@Request() req : any, @Body() body : UserValidatingDto)
  {
    return await this.friendshipService.remove({Userone: req.user.username, Usertwo: body.Userone});
  }

  // @Post('blocking')
  // @UsePipes(new UservalidatingPipe())
  // async blocking(@Body() body: DealingWithRequestDto)
  // {
  //   return await this.friendshipService.blocking(body);
  // }

  @Post('blocking')
  @UsePipes(new UservalidatingPipe())
  async blocking(@Request() req : any, @Body() body : UserValidatingDto)
  {
    return await this.friendshipService.blocking({Userone: req.user.username, Usertwo: body.Userone});
  }

  // @Post('blocklist')
  // @UsePipes(new UservalidatingPipe())
  // async blocklist(@Body() id : UserValidatingDto)
  // {
  //  this.logger.debug(id.Userone);
  //   return await this.friendshipService.blocklist(id);
  // }

  @Get('blocklist')
  async blocklist(@Request() req : any)
  {
    return await this.friendshipService.blocklist(req.user.username);
  }

  // @Post('requestsList')
  // @UsePipes(new UservalidatingPipe())
  // async requestsList(@Body() id: UserValidatingDto)
  // {
  //   return await this.friendshipService.requestsList(id);
  // }

  @Get('requestsList')
  async requestsList(@Request() req : any)
  {
    return await this.friendshipService.requestsList(req.user.username);
  }

  // @Post('accept')
  // @UsePipes(new UservalidatingPipe())
  // async accepting(@Body() body : DealingWithRequestDto)
  // {
  //   return await this.friendshipService.accepting(body)
  // }

  @Post('accept')
  @UsePipes(new UservalidatingPipe())
  async accepting(@Request() req : any, @Body() body : UserValidatingDto)
  {
    return await this.friendshipService.accepting({Userone: req.user.username, Usertwo: body.Userone})
  }

  // @Post('send')
  // @UsePipes(new UservalidatingPipe())
  // async send(@Body() body : DealingWithRequestDto)
  // {
  //   return await this.friendshipService.create(body);
  // }

  @Post('send')
  @UsePipes(new UservalidatingPipe())
  async send(@Request() req : any, @Body() body : UserValidatingDto)
  {
    return await this.friendshipService.create({Userone: req.user.username, Usertwo: body.Userone});
  }
}
