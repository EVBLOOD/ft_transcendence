import { Component, OnInit } from '@angular/core';
import { ChatService, CreatePunishmentDto, UpdateChatroomDTO, addUserDTO, createChatroom, sendMessageDTO } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  constructor(private readonly ChatService: ChatService) {
  }
  ngOnInit(): void {
  }
  getUserChatrooms(name: string) {
    return this.ChatService.getChatrooms(name).subscribe({ next: (data) => { console.log(data) }, error: (err) => console.log("here: ", err) });
  }

  addUser(name: string) {
    const user: addUserDTO = {
      userName: name,
    }
    return this.ChatService.addUser(user).subscribe({ next: () => console.log(`user ${user} created`), error: (err) => { console.log(err) } });
  }
  createChatroom(name: string, type: string, password: string, user: string, otherUser: string) {
    const chat: createChatroom = {
      type: type,
      chatroomName: name,
      password: password,
      user: user,
      otherUser: otherUser
    };
    console.log(chat)
    return this.ChatService.joinChatroom(chat).subscribe({ next: (data) => { console.log(data) } });
  }

  getChatroomMessages(id: string) {
    return this.ChatService.getChatroomMessages(Number(id)).subscribe({ next: (data) => { console.log(data) } });
  }
  getUser() {
    return this.ChatService.getUser().subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) })
  }
  addUserToChatRoom(id: string, user: string, password: string) {
    return this.ChatService.addUserToChatRoom(id, user, password).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) })
  }
  addAdminToChatRoom(id: string, admin: string, user: string) {
    return this.ChatService.addAdminToChatRoom(id, admin, user).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) })
  }
  sendMessage(chatID: string, userName: string, value: string) {
    const message: sendMessageDTO = {
      charRoomId: Number(chatID),
      value: value,
      userName: userName,
    };
    return this.ChatService.sendMessage(message)
  }
  getUserMessages(userName: string): any {
    return this.ChatService.getUserMessages(userName).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) });
  }
  kickuser(chatID: string, admin: string, user: string) {
    return this.ChatService.kickuser(Number(chatID), admin, user).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) });
  }
  // kickAdmin(chatID: string, admin: string, admin2kick: string) {
  //   console.log("called : ", chatID, admin, admin2kick);
  //   return this.ChatService.kickAdmin(Number(chatID), admin, admin2kick).subscribe({next: (data) => console.log(data), error: (err) => console.log(err)});
  // }
  leaveChatroom(id: string, name: string) {
    return this.ChatService.leaveChatroom(Number(id), name).subscribe({ next: (data) => { console.log(data) }, error: (err) => console.log(err) })
  }

  updateChatroom(id: string, user: string, newChatType: string, newPass: string, ChatName: string) {
    const dto: UpdateChatroomDTO = {
      newType: newChatType,
      newChatroomName: ChatName,
      newPassword: newPass,
    };
    return this.ChatService.updateChatroom(Number(id), user, dto).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) });
  }
  PunishUser(chatID__2: string, Admin__: string, penaltyType: string, user11: string) {
    const dto: CreatePunishmentDto = {
      type: penaltyType,
      user: user11,
      chatID: Number(chatID__2),
    };
    console.log(dto);
    this.ChatService.PunishUser(Admin__, dto);
    // return this.ChatService.PunishUser(Admin__, dto).subscribe({next: (data)=> console.log(data), error: (err)=> console.log(err)});
  }
  checkPunishment(id: string, user: string, type: string) {
    return this.ChatService.checkPunishment(Number(id), user, type).subscribe({ next: (data) => console.log(data), error: (err) => console.log(err) });
  }
}
