import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AboutGamesService {

  constructor(private client: HttpClient) { }

  getHistory() {
    return this.client.get('http://10.13.4.8:3000/match/', { withCredentials: true });
  }

  getPlayersHistory() {
    return this.client.get('http://10.13.4.8:3000/match/all', { withCredentials: true });
  }

  APlayersHistory(id: string) {
    return this.client.get('http://10.13.4.8:3000/match/player/' + id, { withCredentials: true });
  }

  Leadring() {
    return this.client.get('http://10.13.4.8:3000/match/leadring', { withCredentials: true });
  }

  leader(id: string) {
    return this.client.get('http://10.13.4.8:3000/match/leader/' + id, { withCredentials: true });
  }


  Ilead() {
    return this.client.get('http://10.13.4.8:3000/match/Ilead', { withCredentials: true });
  }

  playerWinns(id: string) {
    return this.client.get('http://10.13.4.8:3000/match/play/' + id, { withCredentials: true })
  }

  playerLost(id: string) {
    return this.client.get('http://10.13.4.8:3000/match/playU/' + id, { withCredentials: true })
  }
}
