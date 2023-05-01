import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  create(@Body() createFriendshipDto: CreateFriendshipDto) {
    return this.friendshipService.create(createFriendshipDto);
  }

  // @Get()
  // findAll() {
  //   return this.friendshipService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendshipService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendshipDto: UpdateFriendshipDto) {
  //   return this.friendshipService.update(+id, updateFriendshipDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.friendshipService.remove(+id);
  // }
}
