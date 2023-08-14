import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { hostIp } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class AboutGamesService {

  constructor(private client: HttpClient) { }

  getHistory() {
    return this.client.get(`${hostIp}:3000/match/`, { withCredentials: true });
  }

  getPlayersHistory() {
    return this.client.get(`${hostIp}:3000/match/all`, { withCredentials: true });
  }

  APlayersHistory(id: string) {
    return this.client.get(`${hostIp}:3000/match/player/` + id, { withCredentials: true });
  }

  Leadring() {
    return this.client.get(`${hostIp}:3000/match/leadring`, { withCredentials: true });
  }

  Leadring_() {
    return this.client.get(`${hostIp}:3000/match/leadringFIRST`, { withCredentials: true });
  }

  leader(id: string) {
    return this.client.get(`${hostIp}:3000/match/leader/` + id, { withCredentials: true });
  }


  Ilead() {
    return this.client.get(`${hostIp}:3000/match/Ilead`, { withCredentials: true });
  }

  playerWinns(id: string) {
    return this.client.get(`${hostIp}:3000/match/play/` + id, { withCredentials: true })
  }

  playerLost(id: string) {
    return this.client.get(`${hostIp}:3000/match/playU/` + id, { withCredentials: true })
  }
}
