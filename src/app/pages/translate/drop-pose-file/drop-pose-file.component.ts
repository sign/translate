import {Component, HostBinding} from '@angular/core';
import {Store} from '@ngxs/store';
import {UploadPoseFile} from '../../../modules/translate/translate.actions';

@Component({
  selector: 'app-drop-pose-file',
  templateUrl: './drop-pose-file.component.html',
  styleUrls: ['./drop-pose-file.component.scss'],
})
export class DropPoseFileComponent {
  @HostBinding('class.hovering')
  isHovering = false;

  constructor(private store: Store) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    const file = files[0];
    if (!file.name.endsWith('.pose')) {
      alert('Please select a .pose file');
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    this.store.dispatch(new UploadPoseFile(fileUrl));
  }
}
