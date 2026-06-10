import {Component, inject} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';

@Component({
  selector: 'app-rylo-redirect-overlay',
  standalone: true,
  templateUrl: './rylo-redirect-overlay.component.html',
  styleUrl: './rylo-redirect-overlay.component.scss',
})
export class RyloRedirectOverlayComponent {
  private ga = inject(GoogleAnalyticsService);

  readonly visible = !Capacitor.isNativePlatform();
  readonly redirectUrl = 'https://rylo.com/sign/translate';

  async redirect(event: Event): Promise<void> {
    event.preventDefault();
    try {
      await this.ga.logEvent('rylo_redirect_click');
    } catch {
      // Analytics must never block the redirect.
    }
    window.location.href = this.redirectUrl;
  }
}
