import {Component} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {FirebaseAnalytics} from '@capacitor-firebase/analytics';
import {environment} from '../../../environments/environment';

const RYLO_TRANSLATE_URL = 'https://rylo.com/sign/translate';

@Component({
  selector: 'app-rylo-redirect-overlay',
  standalone: true,
  templateUrl: './rylo-redirect-overlay.component.html',
  styleUrl: './rylo-redirect-overlay.component.scss',
})
export class RyloRedirectOverlayComponent {
  readonly visible = !Capacitor.isNativePlatform();
  readonly redirectUrl = RYLO_TRANSLATE_URL;

  async redirect(event: Event): Promise<void> {
    event.preventDefault();
    await this.logRedirectEvent();
    window.location.href = this.redirectUrl;
  }

  private async logRedirectEvent(): Promise<void> {
    if (!environment.firebase.measurementId || !('window' in globalThis)) {
      return;
    }
    try {
      await FirebaseAnalytics.logEvent({name: 'rylo_redirect_click'});
    } catch {
      // Analytics must never block the redirect.
    }
  }
}
