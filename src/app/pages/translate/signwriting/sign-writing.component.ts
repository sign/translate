import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {SignWritingService} from '../../../modules/sign-writing/sign-writing.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {SignWritingObj} from '../../../modules/translate/translate.state';

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss'],
})
export class SignWritingComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  @Input() signs: SignWritingObj[];

  static isCustomElementDefined = false;

  colorSchemeMedia!: MediaQueryList;

  constructor(private mediaMatcher: MediaMatcher) {
    super();

    this.colorSchemeMedia = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
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

        SignWritingService.loadFonts().then().catch();

        // Load the SignWriting custom elements
        import(
          /* webpackChunkName: "@sutton-signwriting/sgnw-components" */ '@sutton-signwriting/sgnw-components/loader'
        )
          .then(({defineCustomElements}) => defineCustomElements())
          .then()
          .catch();
      }
    }
  }
}
