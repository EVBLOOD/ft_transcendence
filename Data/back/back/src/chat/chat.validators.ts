import { HttpException, HttpStatus } from '@nestjs/common';
import { createChatroomDTO } from './dto/createChatroom.dto';
import { User } from 'src/user/user.entity';
import { Chat } from './chat.entity';

export function validateChatName(chatRoomName: string): boolean {
  if (chatRoomName == null || !(chatRoomName && chatRoomName.trim())) {
    throw new HttpException('Chatroom cant be empty', HttpStatus.BAD_REQUEST);
  }
  return true;
}

export function validateChatType(chatRoomType: string): boolean {
  switch (chatRoomType) {
    case 'public':
      return true;
    case 'password':
      return true;
    case 'private':
      return true;
    case 'DM':
      return true;
    default:
      throw new HttpException('Invalid chatroom type', HttpStatus.BAD_REQUEST);
  }
}

export function validateChatPassword(ChatroomPassword: string): boolean {
  if (!(ChatroomPassword && ChatroomPassword.trim())) {
    throw new HttpException('Must set a password', HttpStatus.BAD_REQUEST);
  }
  return true;
}

export function validateChatDTO(chatDTO: createChatroomDTO): boolean {
  validateChatName(chatDTO.chatroomName);
  validateChatType(chatDTO.type);
  if (chatDTO.type === 'password') {
    validateChatPassword(chatDTO.password);
  }
  return true;
}

export function createChatroomEntity(
  chatDTO: createChatroomDTO,
  user: User,
  secondUser?: User | undefined,
): Chat {
  validateChatDTO(chatDTO);
  const chatroom = new Chat();
  chatroom.chatRoomName = chatDTO.chatroomName;
  chatroom.type = chatDTO.type;
  chatroom.member = [user];
  chatroom.owner = user;
  chatroom.admin = [user];
  if (chatDTO.type === 'password') chatroom.password = chatDTO.password;
  if (chatroom.type === 'DM' && secondUser !== undefined) {
    chatroom.member.push(secondUser);
    chatroom.admin.push(secondUser);
  }
  return chatroom;
}

export function deleteUser(chatRoom: Chat, user: string): Chat {
  chatRoom.member = chatRoom.member.filter((u: User) => {
    return u.userName !== user;
  });
  chatRoom.admin = chatRoom.admin.filter((u: User) => {
    return u.userName !== user;
  });
  return chatRoom;
}

export function removeAdminStatus(chat: Chat, user: string): Chat {
  chat.admin = chat.admin.filter((u: User) => {
    return u.userName !== user;
  });
  return chat;
}
