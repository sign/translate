import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-desktop-textarea',
  templateUrl: './desktop-textarea.component.html',
  styleUrl: './desktop-textarea.component.scss',
})
export class DesktopTextareaComponent {
  @Input() maxLength: number;
  @Input() lang: string;
  @Input() textControl: FormControl;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;

  hoveredSentenceIndex = null;
  sentences$!: Observable<string[]>;

  constructor(private store: Store) {
    this.sentences$ = this.store.select<string[]>(state => state.translate.spokenLanguageSentences);
  }
}
