import { Controller, Get, Body, Param, Put, UseGuards, Post, UseInterceptors, UploadedFile, Req, Res, } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/avatar/:path')
  async SendAvatar(@Res() res, @Param('path') path: string) {
    try
    {
      res.sendFile(path, {root: './upload/avatars'});
    }
    catch (err)
    {
      res.status(404).send("file not found");
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post('updateAll') //everybody is talking about adding a function in order this to work {UpdateUserDto}
  async update(@Req() req, @Body() updateUserDto: CreateUserDto) {
    return await this.userService.update(req.new_user.sub, updateUserDto);
  }


  @Put('upload')
  @UseInterceptors(FileInterceptor('file', 
      {
        storage: diskStorage
        (
          {
            destination: './upload/avatars',
            filename:  (req, file, callback) => {
              if ((file.mimetype != "image/jpeg" && file.mimetype != "image/png") || (file.size > 2 * 1024 * 1024))
                callback(null, null);
              const newname = Math.floor(10 + (99999 - 10) * Math.random()) + Date.now().toString() + '-' + file.originalname;
              callback(null, newname);
            },
          }
        )
      },
      ))
  async UploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File)
  {
    if (file?.filename && file.filename != "") {
      await this.userService.UpdateAvatar(req.new_user.sub, file.filename);
      return "file created";
    }
    return "something went down"
  }
}
