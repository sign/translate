import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-flag-icon',
  templateUrl: './flag-icon.component.html',
  styleUrls: ['./flag-icon.component.scss'],
})
export class FlagIconComponent {
  @Input() country: string;
  @Input() squared: boolean;
}
