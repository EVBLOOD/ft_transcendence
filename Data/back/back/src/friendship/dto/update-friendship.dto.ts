import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendshipDto } from './create-friendship.dto';

export class UpdateFriendshipDto extends PartialType(CreateFriendshipDto) {}
