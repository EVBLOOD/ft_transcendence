import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private readonly httpClient: HttpClient
              ) {}
  getChatrooms(username: string) {
    return this.httpClient.get(`localhost:3000/chat/user/${username}`)
  }
}

