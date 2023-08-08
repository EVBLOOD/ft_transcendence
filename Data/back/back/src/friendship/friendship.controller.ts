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
  UserIdValidatingDto,
} from './dto/create-friendship.dto';
import { UservalidatingPipe } from './uservalidating/uservalidating.pipe';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';

@UseGuards(JwtAuthGuard)
@Controller('friendship')
export class FriendshipController {
  private readonly logger = new Logger(FriendshipController.name);
  constructor(private readonly friendshipService: FriendshipService) { }

  @Get()
  itsMe(@Request() req: any) {
    return req.new_user.user_name;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('find/:id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const replay = await this.friendshipService.findOne(req.new_user.sub, id);
    return replay;
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
    return replay;
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
    return replay;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('friendStatus')
  @UsePipes(new UservalidatingPipe())
  async FriendshipStatus(@Request() req: any, @Body() body: UserIdValidatingDto) {
    try {
      const replay = await this.friendshipService.FriendshipStatus(
        req.new_user.sub,
        body.id,
      );
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
    return replay;
  }
}
