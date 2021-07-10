import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-signwriting',
  templateUrl: './signwriting.component.html',
  styleUrls: ['./signwriting.component.scss']
})
export class SignwritingComponent {
  @Input() signs: string[];
}
