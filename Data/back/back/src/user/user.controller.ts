import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Res,
  HttpException,
  HttpStatus,
  ClassSerializerInterceptor,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/create-user.dto';
import * as sharp from 'sharp';


@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    const replay = await this.userService.findAll(skip, take);
    if (replay) return replay;
    throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('_me')
  async thisIsME(@Req() req) {
    const replay = await this.userService.findOne(req.new_user.sub);
    if (replay) return replay;
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const replay = await this.userService.findOne(id);
    if (replay) return replay;
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('getUsers/:username')
  async findUsers(@Param('username') username: string) {
    const replay = await this.userService.findUsersByUserName(username);
    if (replay) return replay;
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('updateAll')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      const replay = await this.userService.updateSimpleInfo(
        req.new_user.sub,
        updateUserDto,
      );
      if (replay) return replay;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
        { cause: err },
      );
    }
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload/avatars',
        filename: (req: any, file: any, callback: any) => {
          if (
            (!file || file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') ||
            file.size > 1 * 1024 * 1024
          )
            callback(null, '');
          const newname =
            Math.floor(10 + (99999 - 10) * Math.random()) +
            Date.now().toString() +
            '-' +
            file.originalname;
          callback(null, newname);
        },
      }),
    }),
  )
  async UploadAvatar(
    @Res() res,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file && file.filename && file.filename != '' && (await sharp("./upload/avatars/" + file.filename).metadata())) {

        ;
        await this.userService.UpdateAvatar(req.new_user.sub, file.filename);
        throw new HttpException('ACCEPTABLE', HttpStatus.ACCEPTED);
      }
    } catch (error) {
      if (error.status == 202)
        throw new HttpException('ACCEPTABLE', HttpStatus.ACCEPTED);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
    throw new HttpException('NOT_ACCEPTABLE', HttpStatus.NOT_ACCEPTABLE);
  }
}
