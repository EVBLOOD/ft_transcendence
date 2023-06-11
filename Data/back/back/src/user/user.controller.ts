import { Controller, Get, Body, Param, Put, UseGuards, Post, UseInterceptors, UploadedFile, } from '@nestjs/common';
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

  @Post(':id') //everybody is talking about adding a function in order this to work {UpdateUserDto}
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }


  @Put('upload')
  @UseInterceptors(FileInterceptor('file', 
      {
        storage: diskStorage
        (
          {
            destination: './upload/avatars',
            filename: async (req, file, callback) => {
              console.log('lol_');
              if ((file.mimetype != "image/jpeg" && file.mimetype != "image/png") || (file.size > 2 * 1024 * 1024))
                await callback(null, null);
              console.log('lol__');
              const newname = Math.floor(10 + (99999 - 10) * Math.random()) + Date.now().toString() + '-' + file.originalname;
              console.log('lol__—');
              await callback(null, newname);
              console.log('lol-__—');
            },
          }
        )
      }
      ))
  async upload(@UploadedFile() file: Express.Multer.File)
  {
    console.log('nothing-__—');
    console.log(file);
    console.log('nothing  -__—');
    if (file)
    {
      if (file.mimetype != "image/jpeg" && file.mimetype != "image/png")
        return "res.status(418)";
        // res.status(418).send("file is not a suported image!");
      if (file.size > 2 * 1024 * 1024) // 2M
        return "res.status(413)";
      // res.status(413).send("file too large!");
      return "res.status(201)"
    }
    else
      console.log("no file to upload");
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
    return "res.status(413)";
  }
}
