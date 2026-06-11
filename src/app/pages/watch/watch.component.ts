import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {informationCircleOutline} from 'ionicons/icons';
import {LogoComponent} from '../../components/logo/logo.component';
import {SignedLanguageOutputComponent} from '../translate/spoken-to-signed/signed-language-output/signed-language-output.component';
import {ANDROID_PLAY_STORE_URL} from '../../core/constants';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
  imports: [LogoComponent, RouterLink, SignedLanguageOutputComponent, IonIcon],
})
export class WatchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  constructor() {
    addIcons({informationCircleOutline});
  }

  text = '';
  hasParams = false;
  isAndroid = false;
  showAppBanner = true;
  androidStoreUrl = ANDROID_PLAY_STORE_URL;

  ngOnInit(): void {
    if ('navigator' in globalThis) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }

    this.route.queryParams
      .pipe(
        tap(params => {
          this.text = params['text'] || '';
          this.hasParams = !!this.text;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
