import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {font} from '@sutton-signwriting/font-ttf/index.js';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {defineCustomElements as defineCustomElementsSW} from '@sutton-signwriting/sgnw-components/loader';

// Set local font directory, copied from @sutton-signwriting/font-ttf
font.cssAppend('assets/fonts/signwriting/');

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss'],
})
export class SignWritingComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() signs: string[];

  // Rerender when scheme changes
  colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  static isCustomElementDefined = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    fromEvent(this.colorSchemeMedia, 'change')
      .pipe(
        tap(() => {
          // Update signs to force re-rendering
          const signs = this.signs;
          this.signs = [];
          requestAnimationFrame(() => (this.signs = signs));
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const signs = changes.signs.currentValue;
    if (signs && signs.length > 0) {
      // Load the SignWriting custom elements
      if (!SignWritingComponent.isCustomElementDefined) {
        defineCustomElementsSW().then().catch();
        SignWritingComponent.isCustomElementDefined = true;
      }
    }
  }
}
