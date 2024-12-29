import {Component} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.scss'],
  imports: [TranslocoPipe],
})
export class SendFeedbackComponent {}
