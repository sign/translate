import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BroadcastTestComponent} from '../../audio/broadcast-test/broadcast-test.component';

@Component({
  selector: 'app-video-help',
  templateUrl: './video-help.component.html',
  styleUrls: ['./video-help.component.scss']
})
export class VideoHelpComponent {

  constructor(private dialog: MatDialog) {
  }

  broadcastTest(): void {
    this.dialog.open(BroadcastTestComponent);
  }

}
