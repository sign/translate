import {Component, ElementRef, Input, ViewChild, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-desktop-textarea',
  templateUrl: './desktop-textarea.component.html',
  styleUrl: './desktop-textarea.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
})
export class DesktopTextareaComponent {
  private store = inject(Store);

  @Input() maxLength: number;
  @Input() lang: string;
  @Input() textControl: FormControl;
  @ViewChild('textarea') textarea: ElementRef<HTMLTextAreaElement>;

  hoveredSentenceIndex = null;
  sentences$!: Observable<string[]>;

  constructor() {
    this.sentences$ = this.store.select<string[]>(state => state.translate.spokenLanguageSentences);
  }
}
