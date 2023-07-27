// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { UserService } from 'src/user/user.service';
// import { Admin, Repository, ReturnDocument } from 'typeorm';
// import { Chat } from './entities/chat.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// // import { User } from 'src/user/user.entity';
// // import { createPunishmentDTO } from './punishment/dto/createPunishment.dto';
// import { throws } from 'assert';
// import { User } from 'src/user/entities/user.entity';

// @Injectable()
// export class ChatUtils {
//   constructor(
//     @InjectRepository(Chat)
//     private readonly chatRoomRepo: Repository<Chat>,
//     private readonly userService: UserService,
//   ) { }

//   async getUser(id: number) {
//     if (id) {
//       const user = await this.userService.findOne(id);
//       if (user) return user;
//       return null;
//     }
//     // throw new HttpException(`User ${id} Not Found`, HttpStatus.NOT_FOUND);
//   }
//   async checkForAdminRoll(chatID: number, id: number) {
//     console.log(id)
//     const admin = await this.chatRoomRepo.findOne({
//       relations: {
//         admin: true,
//       },
//       where: {
//         id: chatID,
//         admin: {
//           id: id,
//         },
//       },
//     });
//     console.log(await this.chatRoomRepo.findOne({
//       relations: {
//         admin: true,
//       },
//       where: {
//         id: chatID,
//       },
//     }))
//     if (admin) return true;
//     return false;
//   }

//   async checkForMemberRoll(chatID: number, id: number) {
//     const chatroom = await this.chatRoomRepo.findOne({
//       relations: {
//         member: true,
//       },
//       where: {
//         id: chatID,
//         member: {
//           id: id,
//         },
//       },
//     });
//     if (chatroom) {
//       // if (
//       //   chatroom.member.some((user: User) => {
//       //     user.userName === Name;
//       //   })
//       // ) {
//       return true;
//       // }
//     }
//     return false;
//   }

//   async checkForOwnerRoll(chatID: number, id: number) {
//     const owner = await this.chatRoomRepo.findOne({
//       relations: {
//         owner: true,
//       },
//       where: {
//         id: chatID,
//         owner: {
//           id: id,
//         },
//       },
//     });
//     if (owner) return true;
//     return false;
//   }
//   async isMoreThenOneAdminInChatroom(chatID: number) {
//     const chatroom = await this.chatRoomRepo.findOne({
//       where: {
//         id: chatID,
//       },
//       relations: {
//         admin: true,
//       },
//     });
//     if (chatroom) {
//       if (chatroom.admin.length > 1) {
//         return true;
//       }
//     }
//     return false;
//   }

//   async isMoreThenOneMemberInChatroom(chatID: number) {
//     const chatroom = await this.chatRoomRepo.findOne({
//       where: {
//         id: chatID,
//       },
//       relations: {
//         member: true,
//       },
//     });
//     if (chatroom) {
//       if (chatroom.member.length > 1) {
//         return true;
//       }
//     }
//     return false;
//   }
//   async onlyOneUserInChatroom(chatID: number) {
//     if (
//       (await this.isMoreThenOneAdminInChatroom(chatID)) == true ||
//       (await this.isMoreThenOneMemberInChatroom(chatID)) == true
//     ) {
//       return false;
//     }
//     return true;
//   }
//   async canBePunished(
//     chatID: number,
//     id: number,
//     punishmentDTO: createPunishmentDTO,
//   ) {
//     if ((await this.checkForAdminRoll(chatID, id)) == false) {
//       console.log('admin', id);
//       console.log('chatid', chatID);
//       throw new HttpException(
//         'Not allowed to Punishe users',
//         HttpStatus.FORBIDDEN,
//       );
//     }
//     if ((await this.checkForOwnerRoll(chatID, id)) == true) {
//       throw new HttpException(
//         'Cannot Punishment the chatroom owner',
//         HttpStatus.FORBIDDEN,
//       );
//     }
//     return true;
//   }
// } // end of ChatUtils Class
