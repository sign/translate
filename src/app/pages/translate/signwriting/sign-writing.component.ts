import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {font} from '@sutton-signwriting/font-ttf';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss'],
})
export class SignWritingComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() signs: string[];

  static isCustomElementDefined = false;

  colorSchemeMedia = this.matchMedia();

  constructor() {
    super();
  }

  matchMedia() {
    if ('matchMedia' in globalThis) {
      return globalThis.matchMedia('(prefers-color-scheme: dark)');
    }
    return new EventTarget();
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
      if (!SignWritingComponent.isCustomElementDefined) {
        SignWritingComponent.isCustomElementDefined = true;

        // Set local font directory, copied from @sutton-signwriting/font-ttf
        font.cssAppend('assets/fonts/signwriting/');

        // Load the SignWriting custom elements
        import('@sutton-signwriting/sgnw-components/loader')
          .then(({defineCustomElements}) => defineCustomElements())
          .then()
          .catch();
      }
    }
  }
}
