import {Component} from '@angular/core';
import {Store} from '@ngxs/store';

@Component({
  selector: 'app-about-api',
  templateUrl: './about-api.component.html',
  styleUrls: ['./about-api.component.scss'],
})
export class AboutApiComponent {
  appearance$ = this.store.select<string>(state => state.settings.appearance);

  code = `curl -X POST \\
  https://api.sign.mt/translate \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "text": "Absolutely!",
    "source": "en",
    "target": "us",
    "signer": "Maayan"
  }'`;

  videoUrl = '';

  constructor(private store: Store) {
    this.appearance$.subscribe(appearance => {
      const cleanAppearance = appearance.replace('#', '');
      this.videoUrl = `assets/promotional/about/appearance/${cleanAppearance}.mp4`;
    });
  }
}
