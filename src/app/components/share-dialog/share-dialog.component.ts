import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {copyOutline, checkmarkOutline, closeOutline} from 'ionicons/icons';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  imports: [IonButton, IonIcon],
})
export class ShareDialogComponent {
  @Input() url = '';
  @Output() closed = new EventEmitter<void>();

  copied = false;

  constructor() {
    addIcons({copyOutline, checkmarkOutline, closeOutline});
  }

  async copyUrl(): Promise<void> {
    await navigator.clipboard.writeText(this.url);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('share-backdrop')) {
      this.close();
    }
  }
}
