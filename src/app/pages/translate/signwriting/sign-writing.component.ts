import {Component, CUSTOM_ELEMENTS_SCHEMA, inject} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SignWritingService} from '../../../modules/sign-writing/sign-writing.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {SignWritingObj} from '../../../modules/translate/translate.state';
import {Store} from '@ngxs/store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DescribeSignWritingSign} from '../../../modules/translate/translate.actions';
import {IonProgressBar} from '@ionic/angular/standalone';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss'],
  imports: [IonProgressBar, MatTooltipModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignWritingComponent {
  private mediaMatcher = inject(MediaMatcher);
  private store = inject(Store);

  signs$!: Observable<SignWritingObj[]>;
  signs: SignWritingObj[] = [];

  static isCustomElementDefined = false;

  colorSchemeMedia!: MediaQueryList;

  constructor() {
    this.colorSchemeMedia = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');

    this.signs$ = this.store.select<SignWritingObj[]>(state => state.translate.signWriting);
    this.listenToSigns();

    this.listenToColorChange();
  }

  listenToColorChange() {
    fromEvent(this.colorSchemeMedia, 'change')
      .pipe(
        tap(() => {
          // Update signs to force re-rendering
          const signs = this.signs;
          this.signs = [];
          requestAnimationFrame(() => (this.signs = signs));
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  listenToSigns() {
    this.signs$
      .pipe(
        tap(signs => {
          this.signs = signs;
          if (signs && signs.length > 0) {
            this.loadSGNWComponents();
          }
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  loadSGNWComponents() {
    if (!SignWritingComponent.isCustomElementDefined) {
      SignWritingComponent.isCustomElementDefined = true;

      SignWritingService.loadFonts().then().catch();

      // Load the SignWriting custom elements
      import(/* webpackChunkName: "@sutton-signwriting/sgnw-components" */ '@sutton-signwriting/sgnw-components/loader')
        .then(({defineCustomElements}) => defineCustomElements())
        .then()
        .catch();
    }
  }

  describeSign(sign: SignWritingObj) {
    if (sign.description) {
      return;
    }

    this.store.dispatch(new DescribeSignWritingSign(sign.fsw));
  }
}
