import {Component, inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {arrowForward, book} from 'ionicons/icons';
import {addIcons} from 'ionicons';

@Component({
  selector: 'app-about-api',
  templateUrl: './about-api.component.html',
  styleUrls: ['./about-api.component.scss'],
  imports: [IonButton, IonIcon],
})
export class AboutApiComponent {
  private store = inject(Store);
  appearance$ = this.store.select<string>(state => state.settings.appearance);

  code = `curl -X POST \\
  https://sign.mt/api/v1/spoken-text-to-signed-pose \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "Absolutely!",
    "source": "en",
    "target": "us",
    "signer": "Maayan"
  }'`;

  videoUrl = '';

  constructor() {
    this.appearance$.subscribe(appearance => {
      const cleanAppearance = appearance.replace('#', '');
      this.videoUrl = `assets/promotional/about/appearance/${cleanAppearance}.mp4`;
    });

    addIcons({book, arrowForward});
  }
}
