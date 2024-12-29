import {Component, inject, Input} from '@angular/core';
import {Store} from '@ngxs/store';
import {SetVideo} from '../../../../core/modules/ngxs/store/video/video.actions';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {imagesOutline} from 'ionicons/icons';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  imports: [IonButton, IonIcon, TranslocoDirective],
})
export class UploadComponent {
  private store = inject(Store);

  @Input() isMobile = false;

  uploadEl: HTMLInputElement = document.createElement('input');

  constructor() {
    this.uploadEl.setAttribute('type', 'file');
    this.uploadEl.setAttribute('accept', 'video/*');
    this.uploadEl.addEventListener('change', this.onFileUpload.bind(this));

    addIcons({imagesOutline});
  }

  upload(): void {
    this.uploadEl.click();
  }

  onFileUpload(): void {
    const file = this.uploadEl.files[0];
    if (file) {
      const objectURL = (window.URL || window.webkitURL).createObjectURL(file);
      this.store.dispatch(new SetVideo(objectURL));
    }
  }
}
