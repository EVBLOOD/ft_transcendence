import { Controller, Get, Body, Param, Put, UseGuards, Post, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Put(':id') //everybody is talking about adding a function in order this to work {UpdateUserDto}
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploadedFiles/avatars'
    })
  }))
  upload(@UploadedFile() file: Express.Multer.File, @Res() res)
  {
    console.log("..")
    if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
      return res.status(418).send("file is not a suported image!");
    if (file.size > 2 * 1024 * 1024) // 2M
      return res.status(413).send("file too large!");
      // {
      //   path: file.path,
      //   filename: file.originalname,
      //   mimetype: file.mimetype
      // }
      // private localFilesService: LocalFilesService
      // const avatar = await this.localFilesService.saveLocalFileData(fileData);
    // now we will create the file and store it's path.
    // console.log(file);
    // if (file.)
    return file.buffer;
  }
}
