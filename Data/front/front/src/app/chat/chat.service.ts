import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private readonly httpClient: HttpClient
              ) {}
  getChatrooms() : void {
    // this.httpClient.get(`localhost:3000/user/${userID}`)
  }
}
