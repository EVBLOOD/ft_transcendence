import { Component, Input } from '@angular/core';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-play-withfr',
  templateUrl: './play-withfr.component.html',
  styleUrls: ['./play-withfr.component.scss']
})
export class PlayWithfrComponent {
  constructor(private state: StatusService, public profile: ProfileService, private gaming: GameService) { }
  replay: any;
  status: any;
  @Input() item: any;
  statusLoading(id: any) {
    this.replay = this.state.current_status.subscribe((curr) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
  }
  playwith(id: number) {
    this.gaming.createGame(id);
  }
}
