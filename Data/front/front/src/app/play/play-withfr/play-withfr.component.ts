import { Component, Input, OnDestroy } from '@angular/core';
import { ProfileService } from 'src/app/profile/profile.service';
import { StatusService } from 'src/app/status.service';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-play-withfr',
  templateUrl: './play-withfr.component.html',
  styleUrls: ['./play-withfr.component.scss']
})
export class PlayWithfrComponent implements OnDestroy {
  // subsc
  private removesubsc: any;
  private SubArray: Array<any> = new Array<any>();


  status: any;
  @Input() item: any;

  constructor(private state: StatusService, public profile: ProfileService, private gaming: GameService) { }

  statusLoading(id: any) {
    this.removesubsc = this.state.current_status.subscribe((curr) => {
      const newone = curr.find((obj: any) => { if (obj.id == id) return obj; });
      if (newone)
        return this.status = newone.status;
      else
        this.status = 'Offline'
    });
    this.SubArray.push(this.removesubsc)
  }

  playwith(id: number) {
    this.gaming.createGame(id);
  }

  ngOnDestroy(): void {
    this.SubArray.forEach((element) => { element?.unsubscribe() })
  }
}
