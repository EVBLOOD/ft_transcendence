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
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { existsSync } from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Get('me')
  async thisIsME(@Req() req) {
    const replay = await this.userService.findMe(req.new_user.sub);
    if (replay) return replay;
    throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  }

  // @Get('/avatar/:path')
  // async SendAvatar(@Res() res, @Param('path') path: string) {
  //   if (existsSync('./upload/avatars/' + path)) {
  //     console.log('Ewa?');
  //     res.sendFile(path, { root: './upload/avatars' });
  //     return {};
  //   }
  //   console.log('Ewa?');
  //   throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const replay = await this.userService.findOne(id);
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
        filename: (req, file, callback) => {
          if (
            (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') ||
            file.size > 1 * 1024 * 1024
          )
            callback(null, null);
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
      if (file?.filename && file.filename != '') {
        await this.userService.UpdateAvatar(req.new_user.sub, file.filename);
        throw new HttpException('ACCEPTABLE', HttpStatus.ACCEPTED);
        return;
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
