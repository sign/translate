import {Component, Input} from '@angular/core';
import {font} from '@sutton-signwriting/font-ttf/index.js';

// Set local font directory, copied from @sutton-signwriting/font-ttf
font.cssAppend('assets/fonts/signwriting/');

@Component({
  selector: 'app-signwriting',
  templateUrl: './signwriting.component.html',
  styleUrls: ['./signwriting.component.scss']
})
export class SignwritingComponent {
  @Input() signs: string[];
}
