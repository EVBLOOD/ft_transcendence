import { Controller, Get, Body, Param, Put, UseGuards, Post, UseInterceptors, UploadedFile, Req, } from '@nestjs/common';
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Post('updateAll') //everybody is talking about adding a function in order this to work {UpdateUserDto}
  async update(@Req() req, @Body() updateUserDto: CreateUserDto) {
    return await this.userService.update(req.newuser.username, updateUserDto);
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
    if (file.filename != "") {
      await this.userService.UpdateAvatar(req.newuser.username, file.path);
      return "file created";
    }
    return "something went down"
  }
}
