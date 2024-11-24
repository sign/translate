import {Component, HostBinding, inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {UploadPoseFile} from '../../../modules/translate/translate.actions';
import {DropzoneDirective} from '../../../directives/dropzone.directive';

@Component({
  selector: 'app-drop-pose-file',
  templateUrl: './drop-pose-file.component.html',
  styleUrls: ['./drop-pose-file.component.scss'],
  imports: [DropzoneDirective],
})
export class DropPoseFileComponent {
  private store = inject(Store);

  @HostBinding('class.hovering')
  isHovering = false;

  constructor() {
    this.listenExternalFileOpen();
  }

  listenExternalFileOpen() {
    if ('window' in globalThis && 'launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async launchParams => {
        if (!launchParams.files.length) {
          return;
        }

        const files = await Promise.all(launchParams.files.map(f => f.getFile()));
        await this.onDrop(files);
      });
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  async onDrop(files: FileList | File[]) {
    const file = files[0];
    if (!file.name.endsWith('.pose')) {
      alert('Please select a .pose file');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    this.store.dispatch(new UploadPoseFile(fileUrl));
  }
}
