import {Component} from '@angular/core';
import {Store} from '@ngxs/store';
import {SetVideo} from '../../../core/modules/ngxs/store/video/video.actions';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  uploadEl: HTMLInputElement = document.createElement('input');

  constructor(private store: Store) {
    this.uploadEl.setAttribute('type', 'file');
    this.uploadEl.setAttribute('accept', '.mp4, .ogv, .webm');

    this.uploadEl.addEventListener('change', this.onFileUpload.bind(this));

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
