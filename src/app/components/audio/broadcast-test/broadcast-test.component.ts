import {Component} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Select} from '@ngxs/store';
import {AudioStateModel} from '../../../core/modules/ngxs/store/audio/audio.state';

@Component({
  selector: 'app-broadcast-test',
  templateUrl: './broadcast-test.component.html',
  styleUrls: ['./broadcast-test.component.css']
})
export class BroadcastTestComponent {
  @Select(state => state.audio) audioState$: Observable<AudioStateModel>;

  play$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
