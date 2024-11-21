import {Component} from '@angular/core';
import {TranslocoPipe} from '@ngneat/transloco';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.scss'],
  standalone: true,
  imports: [TranslocoPipe],
})
export class SendFeedbackComponent {}
