import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


const users: Array<string> = ["ali", "saad"];

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient
  ) { }

  getChatrooms(name: string) {
    return  this.httpClient.get('http://localhost:3000')
  }

}
