import {
  Controller,
  Post,
  Body,
  Param,
  UsePipes,
  Get,
  UseGuards,
  Request,
  Logger,
  HttpException,
  HttpStatus,
  Req,
  Query,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import {
  DealingWithRequestDto,
  UserValidatingDto,
} from './dto/create-friendship.dto';
import { UservalidatingPipe } from './uservalidating/uservalidating.pipe';
import { Matches } from 'class-validator';
// import { IsauthGuard } from 'src/auth/isauth.guard';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';

@UseGuards(JwtAuthGuard)
@Controller('friendship')
export class FriendshipController {
  private readonly logger = new Logger(FriendshipController.name);
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get()
  itsMe(@Request() req: any) {
    return req.new_user.user_name;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('find/:id')
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  async findOne(@Req() req, @Param('id') id: string) {
    const replay = await this.friendshipService.findOne(req.new_user.sub, id);
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('suggestions')
  async suggestions(
    @Request() req: any,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    const replay = await this.friendshipService.suggested(
      req.new_user.sub,
      skip,
      take,
    );
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('friendList')
  async friendList(
    @Request() req: any,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    const replay = await this.friendshipService.friendList(
      req.new_user.sub,
      skip,
      take,
    );
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('unblock')
  @UsePipes(new UservalidatingPipe())
  async unblock(
    @Request() req: any,
    @Body() body: UserValidatingDto,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    try {
      const replay = await this.friendshipService.unblock(
        req.new_user.sub,
        body.Userone,
      );
      if (!replay) return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('unfriend')
  @UsePipes(new UservalidatingPipe())
  async unfriend(@Request() req: any, @Body() body: UserValidatingDto) {
    try {
      const replay = await this.friendshipService.remove(
        req.new_user.sub,
        body.Userone,
      );
      if (replay) return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('blocking')
  @UsePipes(new UservalidatingPipe())
  async blocking(@Request() req: any, @Body() body: UserValidatingDto) {
    try {
      const replay = await this.friendshipService.blocking(
        req.new_user.sub,
        body.Userone,
      );
      if (replay) return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('blocklist')
  async blocklist(
    @Request() req: any,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    const replay = await this.friendshipService.blocklist(
      req.new_user.sub,
      skip,
      take,
    );
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('friendStatus')
  @UsePipes(new UservalidatingPipe())
  async FriendshipStatus(@Request() req: any, @Body() body: UserValidatingDto) {
    try {
      const replay = await this.friendshipService.FriendshipStatus(
        req.new_user.sub,
        body.Userone,
      );
      console.log(replay);
      return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
  }
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('requestsList')
  async requestsList(
    @Request() req: any,
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    const replay = await this.friendshipService.requestsList(
      req.new_user.sub,
      skip,
      take,
    );
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('accept')
  @UsePipes(new UservalidatingPipe())
  async accepting(@Request() req: any, @Body() body: UserValidatingDto) {
    try {
      const replay = await this.friendshipService.accepting(
        req.new_user.sub,
        body.Userone,
      );
      if (replay) return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('send')
  @UsePipes(new UservalidatingPipe())
  async send(@Request() req: any, @Body() body: UserValidatingDto) {
    try {
      const replay = await this.friendshipService.create(
        req.new_user.sub,
        body.Userone,
      );
      if (replay) return replay;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'BAD_GATEWAY',
        },
        HttpStatus.BAD_GATEWAY,
        { cause: err },
      );
    }
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }
}
